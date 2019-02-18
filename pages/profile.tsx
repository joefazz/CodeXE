import React from 'react';
import { Hero } from '../styled/Hero';
import styled from 'styled-components';

export const Page = styled.div`
    display: grid;
`;

function ProfilePage() {
    return (
        <Page>
            <Hero>Profile</Hero>
        </Page>
    );
}

export default ProfilePage;
