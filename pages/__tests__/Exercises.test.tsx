/* eslint-env: "jest" */

import React from 'react';

import { render } from 'react-testing-library';
import { SocketContext } from '../_app';
import { CONTEXT_DEFAULT } from '../../constants';
import Exercises from '../exercises';
import Exercise from '../exercise';

const EXERCISE_MOCK: Exercise = {
    _id: '0',
    title: 'Python Strings 101',
    description: 'Learn the basics of strings in Python!',
    container: 'python_basics',
    entrypoint: 'main.py',
    length: 3,
    difficulty: 'beginner',
    language: 'python'
};

describe('Exercises Page Snapshot', () => {
    it('Should match Snapshot', () => {
        const { asFragment } = render(
            <SocketContext.Provider value={CONTEXT_DEFAULT}>
                <SocketContext.Consumer>
                    {() => <Exercises exercises={[EXERCISE_MOCK]} />}
                </SocketContext.Consumer>
            </SocketContext.Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Create an exercise', () => {});
