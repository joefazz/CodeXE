import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false
});
import { CodeOutput } from '../styled/CodeOutput';
import { Button } from '../styled/Button';
import { colors, fonts } from '../constants';
import Layout from '../components/Layout';

enum Languages {
    JS = 'JavaScript',
    Python = 'Python',
    CLang = 'C'
}

type State = {
    consoleValue: string;
    output: string;
    selectedLang: Languages;
};

export default class HomePage extends React.Component<{}, State> {
    state = {
        consoleValue: '// Code some JavaScript!\n',
        output: '',
        selectedLang: Languages.JS
    };

    runCode = () => {
        switch (this.state.selectedLang) {
            case Languages.JS:
                try {
                    let result = eval(this.state.consoleValue);
                    this.setState({ output: result });
                } catch (e) {
                    this.setState({ output: '' });
                }
                break;
            case Languages.Python:
                fetch(`http://localhost:4000/python`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code: this.state.consoleValue })
                })
                    .then((res) => res.text())
                    .then((text) => this.setState({ output: text }))
                    .catch((err) => console.log(err));
                break;

            default:
                this.setState({ output: "Sorry this language isn't supported yet!" });
                break;
        }
    };

    switchLanguage = (language: Languages) => {
        this.setState({
            selectedLang: language,
            consoleValue:
                language === Languages.Python
                    ? '# Code some Python\n'
                    : `// Code some ${language}\n`
        });
    };

    render() {
        return (
            <Layout>
                <Page>
                    <CodeSection>
                        <H1>Do coding exercises right in your browser!</H1>
                        <LanguageWrapper>
                            <li
                                onClick={() => this.switchLanguage(Languages.JS)}
                                style={{
                                    borderTopLeftRadius: '5px',
                                    borderBottomLeftRadius: '5px'
                                }}
                            >
                                JavaScript
                            </li>
                            <li onClick={() => this.switchLanguage(Languages.Python)}>Python</li>
                            <li
                                onClick={() => this.switchLanguage(Languages.CLang)}
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
                                lineNumbers: 'off'
                            }}
                            language={'typescript'}
                            onChange={(newVal: string) =>
                                this.setState({
                                    consoleValue: newVal
                                })
                            }
                            value={this.state.consoleValue}
                        />
                        <Button
                            success
                            onClick={this.runCode}
                            style={{
                                fontSize: '1.8rem',
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                marginTop: '15px'
                            }}
                        >
                            Run {this.state.selectedLang}
                        </Button>
                        <CodeOutput>Output: {this.state.output}</CodeOutput>
                    </CodeSection>
                    <InfoSection>
                        <img src={'/static/svgs/Moon.svg'} alt="logo" className="App-logo" />
                        <FeatureArea>
                            <div
                                style={{
                                    marginTop: '10%',
                                    shapeOutside: 'circle(50%)',
                                    height: '30vh',
                                    width: '30vh',
                                    float: 'left',
                                    textAlign: 'right'
                                }}
                            />
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
                                Run real code on actual machines
                            </li>
                            <li>
                                <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                                Learn the basics of some of the most popular languages
                            </li>
                            <li>
                                <EmojiListIcon src={'/static/images/earth-emoji.png'} alt="li" />
                                Don't install a thing
                            </li>
                        </FeatureArea>
                        {/* <FeatureArea>
                            <li>Automagically generated exercises</li>
                            <li>Fully featured code editor</li>
                            <li>Run real code on actual machines</li>
                            <li>Learn the basics of some of the most popular languages</li>
                            <li>Don't install a thing</li>
                        </FeatureArea> */}
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
}

const Page = styled.div`
    display: grid;
    height: 100%;
    grid-gap: 40px 40px;
    grid-template-columns: 120px 1fr 1fr;
    grid-template-rows: 2fr 2fr 0.6fr 1fr;
    grid-template-areas:
        '. demo modules'
        '. demo modules'
        '. demo buttons'
        '. footer footer';
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
`;

const EmojiListIcon = styled.img`
    width: 25px;
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
        font-size: 1.2rem;
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

const Footer = styled.div`
    grid-area: footer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background: ${colors.backgroundDarkTranslucent};

    border-top-left-radius: 9px;
    color: white;
    font-family: ${fonts.body};
    padding: 0 20px;
    font-size: 32px;
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
