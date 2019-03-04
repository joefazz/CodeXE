import React from 'react';
import dynamic from 'next/dynamic';
import { Split } from '../../styled/Split';
import LoadingCode from '../../components/LoadingCode';
import XTerminal from '../../components/Terminal';
import styled from 'styled-components';
import { colors, fonts } from '../../constants';
import { Button } from '../../styled/Button';
import { Response, ReactSetter, Data, ContextResponse } from 'opentypes';
const Monaco: any = dynamic(import('../../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});

type Props = {
    data: {
        code: string;
        progress: number;
        stream: string | WebSocket;
        currentExercise: Data.Exercise;
        response: ContextResponse;
        activity: Response.Activity;
        containerId: string;
    };
    setters: { setCodeWidth: ReactSetter<number>; setCode: ReactSetter<string> };
    presentation: { codeWidth: string | number };
    functions: { nextExercise: () => void; saveCode: () => void };
};

function ActivityWidget({ data, setters, presentation, functions }: Props) {
    const { activity, currentExercise, code, stream, response, containerId, progress } = data;
    const { setCodeWidth, setCode } = setters;
    const { codeWidth } = presentation;
    const { nextExercise, saveCode } = functions;

    return (
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
                        {containerId ? (
                            <XTerminal
                                containerId={containerId}
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
    );
}

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

export default ActivityWidget;
