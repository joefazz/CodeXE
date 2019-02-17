import React, { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { colors, fonts } from '../constants';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});
import Layout from '../components/Layout';
import XTerminal from '../components/Terminal';
import { SocketContext } from './_app';
import { Context } from '../types';
import LoadingCode from '../components/LoadingCode';
import Modal from '../components/Modal';
import Link from 'next/link';

const Page = styled.div`
    display: grid;
    gap: 30px 10px;
    height: 100%;
    width: 100%;
    grid-template-areas:
        'list list list list'
        'header header header header'
        'tutorial code output .'
        '. . . .';
    grid-template-columns: 1fr 2fr 2fr 20px;
    grid-template-rows: 2fr 0.7fr 3fr 10px;
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
`;

const Header = styled.header`
    grid-area: header;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: row;
`;

const Hero = styled.section`
    grid-area: hero;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.backgroundDarkTranslucent};
    font-family: ${fonts.display};
    color: white;
    font-size: 3rem;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 7px;
    /* box-shadow: 2px 3px 4px black; */
`;

const Info = styled.span`
    background-color: ${colors.backgroundDarkTranslucent};
    font-family: ${fonts.body};
    font-size: 1.3rem;
    color: white;
    margin-top: 20px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    padding: 7px 9px;
`;

const List = styled.section`
    grid-area: list;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 12px black;
    background-color: ${colors.backgroundDarkTranslucent};
`;

const Tutorial = styled.article`
    grid-area: tutorial;
    font-family: ${fonts.body};
    background-color: ${colors.backgroundDarkTranslucent};
    color: white;
    font-size: 1.3rem;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
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

    const container: Context = useContext(SocketContext) as Context;

    return (
        <Layout isLoggedIn={false}>
            <Page>
                <Header>
                    <Hero>Exercises</Hero>
                    <Info>
                        Learn a new langugage with one of our pre made exercises, or, make your own
                        to share!
                    </Info>
                </Header>
                <List>
                    <Link href="/activity?id=5c68546ff110a9003e9a358e">
                        <ExerciseCard>
                            <div>
                                <WindowButtonWrapper>
                                    <WindowButton color="#fc5753" />
                                    <WindowButton color="#fdbc40" />
                                    <WindowButton color="#34c748" />
                                </WindowButtonWrapper>
                                <span>Python Strings</span>
                            </div>
                            <ExerciseDescription>
                                <ul style={{ listStyle: 'none' }}>
                                    <li>> Python?!</li>
                                    <li>> Is there a snake?</li>
                                    <li>> I hate snakes!</li>
                                </ul>
                            </ExerciseDescription>
                        </ExerciseCard>
                    </Link>
                    <Link href="/activity?id=1">
                        <ExerciseCard>
                            <div>
                                <WindowButtonWrapper>
                                    <WindowButton color="#fc5753" />
                                    <WindowButton color="#fdbc40" />
                                    <WindowButton color="#34c748" />
                                </WindowButtonWrapper>
                                <span>C++ Pointers</span>
                            </div>
                            <ExerciseDescription>
                                <ul style={{ listStyle: 'none' }}>
                                    <li>> What is a Pointer?</li>
                                    <li>> Sorry what?</li>
                                    <li>> Still don't get it</li>
                                </ul>
                            </ExerciseDescription>
                        </ExerciseCard>
                    </Link>
                    <Link href="/activity?id=2">
                        <ExerciseCard>
                            <div>
                                <WindowButtonWrapper>
                                    <WindowButton color="#fc5753" />
                                    <WindowButton color="#fdbc40" />
                                    <WindowButton color="#34c748" />
                                </WindowButtonWrapper>
                                <span>NodeJS in Anger</span>
                            </div>
                            <ExerciseDescription>
                                <ul style={{ listStyle: 'none' }}>
                                    <li>> What is Node?</li>
                                    <li>> Building a Server</li>
                                    <li>> Advanced Concepts</li>
                                </ul>
                            </ExerciseDescription>
                        </ExerciseCard>
                    </Link>
                    <Modal
                        trigger={<CreateCard>Create Exercise</CreateCard>}
                        title={'Create an exercise to share!'}
                        onConfirm={() => console.log('create')}
                    >
                        <span>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci,
                            illum autem asperiores eaque tempora labore voluptate doloribus mollitia
                            at ex ea sunt sint nulla veniam. Pariatur totam velit error tempore.
                        </span>
                    </Modal>
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
                    <XTerminal containerId={container.id} bidirectional={true} />
                </Output>
                {/* <Footer>This is a footer which will defo have content in it one day</Footer> */}
            </Page>
        </Layout>
    );
}

const CreateCard = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 85%;
    box-shadow: 2px 2px 5px black;
    margin-right: 20px;
    background-color: ${colors.backgroundDark};
    transition: box-shadow 0.3s;
    border-radius: 5px;
    border: 3px dashed white;
    color: white;
    cursor: pointer;
    font-size: 2rem;
    font-weight: light;
    font-family: ${fonts.display};

    :hover {
        box-shadow: 5px 5px 8px black;
    }
`;

const ExerciseCard = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 85%;
    box-shadow: 2px 2px 5px black;
    margin-right: 20px;
    background-color: ${colors.mainBlue};
    transition: box-shadow 0.3s;
    border-radius: 5px;
    cursor: pointer;

    :hover {
        box-shadow: 5px 5px 8px black;
    }

    div {
        display: flex;
        color: white;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: ${colors.backgroundDark};
        font-family: ${fonts.body};
        font-size: 1.2rem;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 5px 5px;
        overflow: hidden;
    }
`;

const WindowButtonWrapper = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const WindowButton = styled.i`
    background-color: ${(props) => props.color};
    border-radius: 50%;
    margin-right: 5px;
    width: 12px;
    height: 12px;
    box-shadow: 0 0 1px ${(props) => props.color};
`;

const ExerciseDescription = styled.code`
    color: white;
    padding-left: 10px;
    font-size: 1rem;
    ul {
        padding: 0;

        li {
            margin: 3px 0;
        }
    }
`;

export default Exercises;
