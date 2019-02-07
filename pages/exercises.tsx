import React, { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { Footer } from '../styled/Footer';
import { colors, fonts } from '../constants';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false
});
import Layout from '../components/Layout';
import XTerminal from '../components/Terminal';
import { ContainerContext } from './_app';
import { Context } from '../types';

const Page = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
    gap: 30px 10px;
    grid-template-areas:
        'hero hero hero .'
        'list list list list'
        'tutorial code output .'
        '. footer footer footer';
    grid-template-columns: 1fr 2fr 2fr 120px;
    grid-template-rows: 2fr 2fr 4fr 1fr;
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
`;

const Hero = styled.section`
    grid-area: hero;
    background-color: ${colors.backgroundDarkTranslucent};
    font-family: ${fonts.display};
    color: white;
    font-size: 2rem;
`;

const List = styled.section`
    grid-area: list;
    background-color: ${colors.backgroundDark};
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`;

const Tutorial = styled.article`
    grid-area: tutorial;
    font-family: ${fonts.body};
    background-color: ${colors.backgroundDarkTranslucent};
    color: white;
    font-size: 1.3rem;
`;

const Code = styled.div`
    grid-area: code;
    width: 100%;
    height: 100%;
`;

const Output = styled.div`
    grid-area: output;
    width: 100%;
    height: 100%;
    position: relative;
`;

function Exercises() {
    const [code, setCode] = useState('// This is the editor');
    const container: Context = useContext(ContainerContext) as Context;

    return (
        <Layout isLoggedIn={false}>
            <Page>
                <Hero>Exercises</Hero>
                <List>
                    <ExerciseCard>aosjdfoi</ExerciseCard>
                    <ExerciseCard>aosjdfoi</ExerciseCard>
                    <ExerciseCard>aosjdfoi</ExerciseCard>
                </List>
                <Tutorial>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis natus ipsa
                    quidem soluta! Perferendis reprehenderit cumque distinctio nostrum nulla
                    excepturi? Voluptate est similique dignissimos nemo esse. In ipsam nam
                    voluptatem?
                </Tutorial>
                <Code>
                    <Monaco
                        height="100%"
                        width="100%"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 18,
                            lineNumbers: 'off',
                            cursorStyle: 'block'
                        }}
                        language={'javascript'}
                        onChange={(newVal: string) => setCode(newVal)}
                        value={code}
                    />
                </Code>
                <Output>
                    <XTerminal container={container.id} />
                </Output>
                <Footer>This is a footer which will defo have content in it one day</Footer>
            </Page>
        </Layout>
    );
}

const ExerciseCard = styled.div`
    width: 200px;
    height: 90%;
    background-color: white;
    box-shadow: 2px 2px 5px black;
`;

export default Exercises;
