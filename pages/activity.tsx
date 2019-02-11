import React, { useState, useContext } from 'react';
import { QueryStringMapObject } from 'next';
import dynamic from 'next/dynamic';
import { ContainerContext } from './_app';
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
    container: string;
    progress: number;
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
    const { socket, response } = useContext(ContainerContext) as Context;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [progress, setProgress] = useState(activity.progress);
    const [currentExercise, setCurrentExercise] = useState(activity.exercises[activity.progress]);
    const [code, setCode] = useState(currentExercise.prebakedCode || '# Python code');

    // socket.send(
    //     JSON.stringify({
    //         type: MessageTypes.EXERCISE_START,
    //         data: { id: activity.container }
    //     })
    // );

    function nextExercise() {
        setProgress((prev) => prev + 1);
        const exercise = activity.exercises[progress];
        setCurrentExercise(activity.exercises[progress]);
        if (exercise.prebakedCode) {
            setCode(exercise.prebakedCode);
        }
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
                            maxSize={-500}
                            minSize={500}
                            style={{ height: '80%' }}
                        >
                            <Monaco
                                language={'python'}
                                width={codeWidth}
                                height={'100%'}
                                value={code}
                                onChange={(text: string) => setCode(text)}
                            />
                            <XTerminal container={activity.container} />
                        </Split>
                    </CodeArea>
                    <ActivityInfo>
                        <h1>{activity.title}</h1>

                        <ButtonArea>
                            <Button success>Run</Button>
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
    // const json = await fetch(`http://localhost:4000/activity?id=${query.id}`).then((res) =>
    //     res.json()
    // );

    const json: ActivityResponse = {
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
        container: '0000',
        language: Languages.PYTHON,
        progress: 0,
        title: 'Python 101',
        length: 12
    };

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
        font-size: 1.3rem;
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
        margin: 5px;
        background-color: #3c4556;
        border-radius: 8px;
        box-shadow: 2px 2px 1px black;
    }
`;

const NextArea = styled.div`
    flex: 1;
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
