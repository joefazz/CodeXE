import React from 'react';
import { Hero } from '../styled-components/Hero';
import styled from 'styled-components';

export const Page = styled.div`
    display: grid;
`;

export class ProfilePage extends React.Component {
    render() {
        return (
            <Page>
                <Hero>Profile</Hero>
            </Page>
        );
    }
}
