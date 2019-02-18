import React, { useState, useContext, useEffect } from 'react';
import { QueryStringMapObject } from 'next';
import dynamic from 'next/dynamic';
import fetch from 'isomorphic-unfetch';
import { SocketContext } from './_app';
import { Context, MessageTypes, Languages } from '../types';
import Layout from '../components/Layout';
import { Split } from '../styled/Split';
import LoadingCode from '../components/LoadingCode';
import XTerminal from '../components/Terminal';
import styled from 'styled-components';
import { colors, fonts } from '../constants';
import { Button } from '../styled/Button';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});

type Exercise = {
    id: number;
    title: string;
    description: string;
    task: string;
    expectedResult: string;
    prebakedCode?: string;
    requiredCode?: string[];
};

type ActivityResponse = {
    language: Languages;
    difficulty: string;
    length: number;
    description: string;
    title: string;
    exercises: Exercise[];
};

type Props = {
    activity: ActivityResponse;
};

function Activity({ activity }: Props) {
    const { socket, response, id } = useContext(SocketContext) as Context;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [progress, setProgress] = useState(0);
    const [currentExercise, setCurrentExercise] = useState(activity.exercises[0]);
    const [code, setCode] = useState(currentExercise.prebakedCode || '# Python code');
    const [stream, setStream] = useState<WebSocket | string>('');

    useEffect(() => {
        if (socket) {
            console.log('here');
            socket.send(JSON.stringify({ type: MessageTypes.CONTAINER_STOP, data: { id } }));

            socket.send(
                JSON.stringify({
                    type: MessageTypes.EXERCISE_START,
                    data: { exerciseID: 0 }
                })
            );
        } else {
            console.log('no socket');
        }
    }, [socket]);

    useEffect(() => {
        if (response.metaData.didSave) {
            console.log(response);
            let stream = new WebSocket(
                `ws://localhost:4000/exercise?id=${
                    response.metaData.exerciseContainerId
                }&repl="python"&filename="main.py"`
            );

            setStream(stream);
        }
    }, [response.metaData.didSave]);

    function nextExercise() {
        setProgress((prev) => prev + 1);
        const exercise = activity.exercises[progress];
        setCurrentExercise(activity.exercises[progress]);
        if (exercise.prebakedCode) {
            setCode(exercise.prebakedCode);
        }
    }

    function saveCode() {
        socket.send(
            JSON.stringify({
                type: MessageTypes.CODE_SAVE,
                data: {
                    id: response.metaData.exerciseContainerId,
                    filename: 'main.py',
                    code
                }
            })
        );
    }

    return (
        <Layout isLoggedIn={false}>
            <Split
                split={'vertical'}
                defaultSize={350}
                onChange={(size) => setCodeWidth((prev: number) => prev + size)}
                maxSize={350}
                minSize={250}
            >
                <TutorialArea>
                    <TaskArea>
                        <h1>{currentExercise.title}</h1>
                        <span>{currentExercise.description}</span>
                        <code>{currentExercise.task}</code>
                        <Button
                            primary
                            style={{ flex: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                            onClick={() => nextExercise()}
                        >
                            Next
                        </Button>
                    </TaskArea>
                </TutorialArea>
                <SecondPane>
                    <CodeArea>
                        <Split
                            split={'vertical'}
                            onChange={(size) => setCodeWidth(size)}
                            defaultSize={'75%'}
                            maxSize={-250}
                            minSize={500}
                            style={{ height: '80%' }}
                        >
                            <Monaco
                                language={'python'}
                                width={codeWidth}
                                height={'100%'}
                                options={{
                                    fontSize: 18,
                                    minimap: { enabled: false },
                                    cursorStyle: 'block'
                                }}
                                value={code}
                                onChange={(text: string) => setCode(text)}
                            />
                            {response.metaData.exerciseContainerId ? (
                                <XTerminal
                                    containerId={response.metaData.exerciseContainerId}
                                    bidirectional={true}
                                    output={response.writeData || ''}
                                    customStream={stream}
                                />
                            ) : (
                                <LoadingTerm>
                                    <span>Loading: {activity.title} Machine...</span>
                                </LoadingTerm>
                            )}
                        </Split>
                    </CodeArea>
                    <ActivityInfo>
                        <h1>{activity.title}</h1>

                        <ButtonArea>
                            <Button success onClick={() => saveCode()}>
                                Run
                            </Button>
                        </ButtonArea>

                        <Details>
                            <code>
                                {progress}/{activity.length}
                            </code>
                            <code>Difficulty: {activity.difficulty}</code>
                        </Details>
                    </ActivityInfo>
                </SecondPane>
            </Split>
        </Layout>
    );
}

Activity.getInitialProps = async ({ query }: { query: QueryStringMapObject }) => {
    const json = await fetch(`http://localhost:4000/activity?id=${query.id}`)
        .then((res) => res.json())
        .catch((err) => console.log(err));

    if (!json) {
        // Fake Data
        const fake: ActivityResponse = {
            description: 'An introduction to the Python programming language',
            difficulty: 'beginner',
            exercises: [
                {
                    title: 'Strings 101',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut gravida facilisis sem id auctor. Integer dictum pellentesque nisi sed dignissim. Suspendisse dapibus vitae velit a laoreet. Cras egestas aliquam aliquam. Phasellus ut lacus fringilla erat vulputate varius. Praesent quis nulla ut ante lobortis sagittis. Nulla a ligula ligula. Pellentesque at libero nisl. Etiam id accumsan ipsum, sit amet fermentum ipsum. Phasellus vel tempus magna, quis auctor lectus. Sed nec nibh eget dolor porttitor congue vel a orci. Vivamus pulvinar dolor elit, ac vehicula nibh aliquet at. Aliquam scelerisque ante elit, a congue orci pulvinar sed. ',
                    id: 0,
                    task: 'Print Hello world',
                    prebakedCode: '# This code is pre baked fam',
                    expectedResult: 'Hello world'
                }
            ],
            language: Languages.PYTHON,
            title: 'Python 101',
            length: 12
        };
        return { activity: fake };
    }

    return { activity: json };
};

export default Activity;

const TutorialArea = styled.section`
    padding: 10px;
    height: calc(100% - 10px);
    font-family: ${fonts.body};
`;

const TaskArea = styled.div`
    display: flex;
    height: calc(100% - 10px);
    flex-direction: column;
    justify-content: space-between;
    background-color: floralwhite;
    border-radius: 5px;
    box-shadow: 2px 2px 3px black;

    h1 {
        margin-top: 15px;
        margin-left: 5px;
        flex: 1;
    }

    span {
        font-size: 1.1rem;
        margin: 5px;
        flex: 9;
    }

    code {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: white;
        font-size: 1.1rem;
        padding: 10px;
        margin: 5px;
        background-color: #3c4556;
        border-radius: 8px;
        box-shadow: 2px 2px 1px black;
    }
`;

const SecondPane = styled.div`
    display: flex;
    align-items: stretch;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
`;

const CodeArea = styled.div`
    flex: 13;
`;

const ActivityInfo = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${colors.backgroundDark};
    padding: 0 10px;
    color: white;

    h1 {
        flex: 2;
        font-family: ${fonts.display};
        font-size: 2rem;
        font-weight: normal;
    }
`;

const ButtonArea = styled.div`
    flex: 0.5;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

const Details = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const LoadingTerm = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    color: white;
    font-family: Consolas, monospace;
    font-size: 24px;
`;
