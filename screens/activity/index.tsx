import React, { useState, useContext, useEffect } from 'react';
import { QueryStringMapObject } from 'next';
import fetch from 'isomorphic-unfetch';
import { SocketContext } from '../../pages/_app';
import { Context, MessageTypes, Languages, Response } from '../../@types';
import Layout from '../../components/Layout';
import ActivityWidget from './ActivityWidget';

type Props = {
    activity: Response.Activity;
};

function Activity({ activity }: Props) {
    const { socket, response, id, exerciseId } = useContext(SocketContext) as Context;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [progress, setProgress] = useState(0);
    const [currentExercise, setCurrentExercise] = useState(activity.exercises[0]);
    const [code, setCode] = useState(currentExercise.prebakedCode || '# Python code');
    const [stream, setStream] = useState<WebSocket | string>('');

    useEffect(() => {
        if (socket) {
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

        /**
         * I really don't know why this doesn't work but what, fuckin, ever
         */
        // return function cleanup() {
        //     console.log(exerciseId);
        //     socket.send(
        //         JSON.stringify({
        //             type: MessageTypes.EXERCISE_STOP,
        //             data: { id: exerciseId, containerId: id }
        //         })
        //     );
        // };
    }, [socket]);

    useEffect(() => {
        if (response.metaData.saveInfo.succeed) {
            console.log(response);
            let stream = new WebSocket(
                `ws://localhost:4000/exercise?id=${exerciseId}&repl="python"&filename="main.py"`
            );

            setStream(stream);
        }
    }, [response.metaData.saveInfo.timestamp]);

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
                    id: exerciseId,
                    filename: activity.entrypoint,
                    code
                }
            })
        );
    }

    return (
        <Layout isLoggedIn={false}>
            <ActivityWidget
                data={{
                    activity,
                    progress,
                    currentExercise,
                    code,
                    stream,
                    response,
                    containerId: exerciseId
                }}
                presentation={{ codeWidth }}
                setters={{ setCode, setCodeWidth }}
                functions={{ saveCode, nextExercise }}
            />
        </Layout>
    );
}

Activity.getInitialProps = async ({ query }: { query: QueryStringMapObject }) => {
    const json = await fetch(`http://localhost:4000/activity?id=${query.id}`)
        .then((res) => res.json())
        .catch((err) => console.log(err));

    if (!json) {
        // Fake Data
        const fake: Response.Activity = {
            description: 'An introduction to the Python programming language',
            difficulty: 'beginner',
            entrypoint: 'main.py',
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
