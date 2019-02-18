import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});
import { CodeOutput } from '../styled/CodeOutput';
import { Button } from '../styled/Button';
import { Footer } from '../styled/Footer';
import { colors, fonts } from '../constants';
import Layout from '../components/Layout';
import { SocketContext } from './_app';
import { Context, Languages, MessageTypes } from '../types';
import { runCode } from '../functions/run_code';
import LoadingCode from '../components/LoadingCode';

function HomePage() {
    const { socket, id, containerName, response } = useContext(SocketContext) as Context;

    const [code, setCode] = useState('// Code some JavaScript!\n');
    const [language, setLang] = useState(Languages.JS);

    function switchLanguage(language: Languages) {
        setCode(
            language === Languages.JS
                ? '// Enter some JavaScript'
                : language === Languages.PYTHON
                ? '# Enter some Python'
                : '// Enter some C'
        );

        setLang(language);
    }

    useEffect(() => {
        if (response.metaData.saveInfo.succeed) {
            const filename =
                language === Languages.JS
                    ? 'index.js'
                    : language === Languages.PYTHON
                    ? 'main.py'
                    : 'main.c';

            runCode({ id, filename, language, socket });
        }
    }, [response.metaData.saveInfo.timestamp]);

    function saveCode() {
        const filename =
            language === Languages.JS
                ? 'index.js'
                : language === Languages.PYTHON
                ? 'main.py'
                : 'main.c';

        socket.send(
            JSON.stringify({
                type: MessageTypes.CODE_SAVE,
                data: {
                    id,
                    filename, // this depends on lang
                    code
                }
            })
        );
    }

    return (
        <Layout isLoggedIn>
            <Page>
                <CodeSection>
                    <H1>Do coding exercises right in your browser!</H1>
                    <LanguageWrapper>
                        <li
                            onClick={() => switchLanguage(Languages.JS)}
                            style={{
                                borderTopLeftRadius: '5px',
                                borderBottomLeftRadius: '5px'
                            }}
                        >
                            JavaScript
                        </li>
                        <li onClick={() => switchLanguage(Languages.PYTHON)}>Python</li>
                        <li
                            onClick={() => switchLanguage(Languages.C)}
                            style={{
                                borderRight: 'none',
                                borderTopRightRadius: '5px',
                                borderBottomRightRadius: '5px'
                            }}
                        >
                            C
                        </li>
                    </LanguageWrapper>
                    <Monaco
                        height="100%"
                        width="100%"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 18,
                            lineNumbers: 'off',
                            cursorStyle: 'block'
                        }}
                        language={language}
                        onChange={(newVal: string) => setCode(newVal)}
                        value={code}
                    />
                    <div>
                        <Button
                            success
                            onClick={() => saveCode()}
                            style={{
                                fontSize: '1.8rem',
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0
                            }}
                        >
                            Run
                        </Button>
                    </div>
                    <CodeOutput>
                        {containerName === ''
                            ? 'Disconnected'
                            : containerName + ': ' + response.writeData.output}
                    </CodeOutput>
                </CodeSection>
                <InfoSection>
                    <img src={'/static/svgs/Moon.svg'} alt="logo" className="App-logo" />
                    <FeatureArea>
                        <div
                            style={{
                                marginTop: '9%',
                                shapeOutside: 'circle(40%)',
                                height: '35vh',
                                width: '35vh',
                                float: 'left',
                                textAlign: 'right'
                            }}
                        />
                        <br />
                        <li>
                            <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                            Automagically generated exercises
                        </li>

                        <li>
                            <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                            Fully featured code editor
                        </li>
                        <li>
                            <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                            Interact with a full Linux Virtual Machine
                        </li>
                        <li>
                            <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                            Learn the basics of some of the most popular languages
                        </li>
                        <li>
                            <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                            No set up required
                        </li>
                    </FeatureArea>
                </InfoSection>
                <ButtonArea>
                    <Button raised>Log In</Button>
                    <Button
                        primary
                        raised
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        Sign Up
                    </Button>
                </ButtonArea>
                <Footer>
                    <p>
                        OpenStudy is the final year project of{' '}
                        <a href="https://twitter.com/purefazz">Joe Fazzino</a>, he is not
                        responsible for anything evil that you decide to do.
                    </p>
                </Footer>
            </Page>
        </Layout>
    );
}

export default HomePage;

const Page = styled.div`
    display: grid;
    height: 100%;
    grid-gap: 40px 40px;
    grid-template-columns: 120px 1fr 1fr;
    grid-template-rows: 5px 2fr 2fr 0.6fr 1fr;
    grid-template-areas:
        '. . .'
        '. demo modules'
        '. demo modules'
        '. demo buttons'
        '. footer footer';
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
`;

const EmojiListIcon = styled.img`
    width: 3.3%;
    margin-right: 4px;
`;

const CodeSection = styled.div`
    grid-area: demo;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
`;

const InfoSection = styled.div`
    grid-area: modules;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${colors.backgroundDarkTranslucent};
    justify-content: center;
    border-radius: 5px;
`;

const FeatureArea = styled.ul`
    padding: 0;
    margin: 0;
    z-index: 0;

    li {
        list-style: none;
        color: white;
        font-family: ${fonts.body};
        margin-top: 2.2%;
        font-size: 1.4rem;
    }
`;

const ButtonArea = styled.div`
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    button {
        width: 45%;
        font-size: 1.7rem;
    }
`;

const LanguageWrapper = styled.ul`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background-color: ${colors.mainBlue};
    padding: 0;
    border-radius: 5px;
    box-shadow: 0 3px 4px black;

    li {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        list-style: none;
        color: white;
        font-family: ${fonts.display};
        font-size: 24px;
        padding: 5% 10px;
        border-right: 1px solid white;
        cursor: pointer;

        :hover {
            background-color: white;
            color: ${colors.mainBlue};
        }
    }
`;

const H1 = styled.h1`
    background-color: ${colors.backgroundDarkTranslucent};
    border-radius: 5px;
    font-weight: normal;
    font-family: ${fonts.display};
    color: white;
    padding: 5px 10px;
    margin: 0;
`;
