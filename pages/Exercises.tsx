import React from 'react';
import { Hero } from '../styled-components/Hero';
import styled from 'styled-components';

export const Page = styled.div`
    display: grid;
`;

export class ExercisesPage extends React.Component {
    render() {
        return (
            <Page>
                <Hero>Exercises</Hero>
            </Page>
        );
    }
}
