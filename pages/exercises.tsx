import React from 'react';
import { Hero } from '../styled/Hero';
import styled from 'styled-components';

export const Page = styled.div`
    display: grid;
`;

export default class ExercisesPage extends React.Component {
    render() {
        return (
            <Page>
                <Hero>Exercises</Hero>
            </Page>
        );
    }
}
