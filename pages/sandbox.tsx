import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import XTerminal from '../components/Terminal';
import { ContainerContext } from './_app';
import { Context, Languages } from '../types';
import { colors } from '../constants';
import { Button } from '../styled/Button';
import { runCode } from '../functions/run_code';
import LoadingCode from '../components/LoadingCode';
import { Split } from '../styled/Split';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});

const Controls = styled.div`
    display: flex;
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
`;

const ControlArea = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
`;

type State = {
    codeWidth: number | string;
    codeHeight: number | string;
    code: string;
    language: { value: Languages; label: string };
};

export default class SandboxPage extends React.Component<{}, State> {
    static contextType = ContainerContext;

    state = {
        codeWidth: '100%',
        code: '// Enter code',
        language: { value: Languages.JS, label: 'JavaScript' },
        codeHeight: '100%'
    };

    context: Context;
    languages = [
        { value: Languages.JS, label: 'JavaScript' },
        { value: Languages.PYTHON, label: 'Python' },
        { value: Languages.C, label: 'C/C++' }
    ];

    render() {
        return (
            <Layout isLoggedIn={false}>
                <Split
                    split={'vertical'}
                    defaultSize="50%"
                    onChange={(size) => this.setState({ codeWidth: size })}
                >
                    <Split
                        split={'horizontal'}
                        defaultSize="95%"
                        maxSize="95%"
                        onChange={(size) => this.setState({ codeHeight: size })}
                    >
                        <Monaco
                            language={this.state.language.value}
                            width={this.state.codeWidth}
                            height={this.state.codeHeight}
                            options={{
                                fontSize: 18,
                                minimap: { enabled: false },
                                cursorStyle: 'block'
                            }}
                            onChange={(newVal: string) =>
                                this.setState({
                                    code: newVal
                                })
                            }
                            value={this.state.code}
                        />
                        <Controls>
                            <ControlArea>
                                <Button
                                    primary
                                    success
                                    style={{
                                        minHeight: '100%',
                                        borderRadius: 0
                                    }}
                                    onClick={() =>
                                        runCode({
                                            id: this.context.id,
                                            language: this.state.language.value,
                                            code: this.state.code,
                                            socket: this.context.socket
                                        })
                                    }
                                >
                                    Save
                                </Button>
                            </ControlArea>
                            <ControlArea>
                                <Select
                                    options={this.languages}
                                    menuPlacement={'auto'}
                                    value={this.state.language}
                                    onChange={(opt) =>
                                        // @ts-ignore
                                        this.setState({
                                            language: opt
                                        })
                                    }
                                />
                            </ControlArea>
                        </Controls>
                    </Split>
                    <XTerminal container={this.context.id} />
                </Split>
            </Layout>
        );
    }
}
