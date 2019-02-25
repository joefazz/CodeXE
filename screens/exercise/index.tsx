import React, { useState, useContext } from 'react';
import fetch from 'isomorphic-unfetch';
import Layout from '../../components/Layout';
import { SocketContext } from '../../pages/_app';
import { Context, Data } from '../../@types';
import ExerciseWidget from './ExerciseWidget';

type Props = {
    exercises: Data.Activity[];
};

function Exercises({ exercises }: Props) {
    const [code, setCode] = useState('// This is the editor');

    const container: Context = useContext(SocketContext) as Context;

    return (
        <Layout isLoggedIn={false}>
            <ExerciseWidget data={{ exercises, code, container }} setters={{ setCode }} />
        </Layout>
    );
}

Exercises.getInitialProps = async () => {
    const json = await fetch('http://localhost:4000/exercises')
        .then((res) => res.json())
        .catch((err) => console.log(err));

    if (!json) {
        // fake data can go here
    }

    return { exercises: json };
};

export default Exercises;
