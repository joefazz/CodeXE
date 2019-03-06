import React from 'react';
import fetch from 'isomorphic-unfetch';
import Layout from '../../components/Layout';
import { Data, Languages } from '../../@types';
import ExerciseWidget from './ExerciseWidget';

type Props = {
    exercises: Data.Exercise[];
};

type IActivity = {
    title: string;
    description: string;
    task: string;
};

export type CreateArgs = {
    title: string;
    description: string;
    language: Languages;
    activities: IActivity[];
};

function Exercises({ exercises }: Props) {
    function submitExercises(args: CreateArgs) {
        console.log(args);
        fetch('http://localhost:4000/create', {
            method: 'post',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(args)
        })
            .then((res) => res.json())
            .then((json) => console.log(json));
    }

    return (
        <Layout isLoggedIn={false}>
            <ExerciseWidget data={{ exercises }} functions={{ submitExercises }} />
        </Layout>
    );
}

Exercises.getInitialProps = async () => {
    const json = await fetch('http://localhost:4000/exercises')
        .then((res) => res.json())
        .catch((err) => console.log(err));

    if (!json) {
        return { exercises: [{ _id: 0 }] };
    }

    return { exercises: json };
};

export default Exercises;
