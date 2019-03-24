import React, { useState, useContext, useEffect } from 'react';
import { QueryStringMapObject } from 'next';
import fetch from 'isomorphic-unfetch';
import { SocketContext } from './_app';
import { Context, MessageTypes, Languages, Response } from '../@types';
import Layout from '../components/Layout';
import ExerciseWidget from '../screens/exercise';

type Props = {
    exercise: Response.Exercise;
};

function Exercise({ exercise }: Props) {
    const { socket, response, id, activityId } = useContext(SocketContext) as Context;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [progress, setProgress] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(exercise.activities[0]);
    const [code, setCode] = useState(currentActivity.prebakedCode || '# Python code');
    const [stream, setStream] = useState<WebSocket | string>('');

    useEffect(() => {
        console.log(socket, activityId);
        if (socket && activityId === '') {
            socket.send(JSON.stringify({ type: MessageTypes.CONTAINER_STOP, data: { id } }));

            socket.send(
                JSON.stringify({
                    type: MessageTypes.EXERCISE_START,
                    data: { image: exercise.container }
                })
            );
        }

        return function cleanup() {
            if (activityId) {
                console.log('DETATCHING FROM EXERCISE');
                socket.send(
                    JSON.stringify({
                        type: MessageTypes.EXERCISE_STOP,
                        data: { id: activityId, containerId: id }
                    })
                );
            }
        };
    }, [socket, activityId]);

    useEffect(() => {
        if (response.metaData.saveInfo.succeed) {
            console.log(response);
            const repl =
                exercise.language === Languages.JS
                    ? 'node'
                    : exercise.language === Languages.C
                    ? 'gcc'
                    : exercise.language;

            console.log(activityId, repl, exercise.entrypoint);
            let stream = new WebSocket(
                `ws://localhost:4000/exercise?id=${activityId}&repl="${repl}"&filename="${
                    exercise.entrypoint
                }"`
            );

            setStream(stream);
        }
    }, [response.metaData.saveInfo.timestamp]);

    function nextExercise() {
        setProgress((prev) => prev + 1);
        const activity = exercise.activities[progress];
        setCurrentActivity(exercise.activities[progress]);
        if (activity.prebakedCode) {
            setCode(activity.prebakedCode);
        }
    }

    function saveCode() {
        socket.send(
            JSON.stringify({
                type: MessageTypes.CODE_SAVE,
                data: {
                    id: activityId,
                    filename: exercise.entrypoint,
                    code
                }
            })
        );
    }

    return (
        <Layout isLoggedIn={false}>
            <ExerciseWidget
                data={{
                    exercise,
                    progress,
                    currentActivity,
                    code,
                    stream,
                    response,
                    containerId: activityId
                }}
                presentation={{ codeWidth }}
                setters={{ setCode, setCodeWidth }}
                functions={{ saveCode, nextExercise }}
            />
        </Layout>
    );
}

Exercise.getInitialProps = async ({ query }: { query: QueryStringMapObject }) => {
    const json = await fetch(`http://localhost:4000/exercise?id=${query.id}`)
        .then((res) => res.json())
        .catch((err) => console.log(err));

    console.log(json);
    if (!json) {
        // Fake Data
        const fake: Response.Exercise = {
            description: 'An introduction to the Python programming language',
            difficulty: 'beginner',
            entrypoint: 'main.py',
            container: 'python_basics',
            activities: [
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
        return { exercise: fake };
    }

    return { exercise: json };
};

export default Exercise;
