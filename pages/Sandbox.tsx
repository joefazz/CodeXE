import React from 'react';
import { Hero } from '../styled-components/Hero';
import styled from 'styled-components';
import { Monaco } from '../components/Monaco';

export const Page = styled.div`
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 9fr 1fr;
    grid-template-areas:
        'code output'
        'controls controls';
`;

export const Code = styled.div`
    grid-area: code;
    background-color: black;
`;

export const Output = styled.div`
    grid-area: output;
    background-color: green;
`;

export const Controls = styled.div`
    grid-area: controls;
    background-color: palegoldenrod;
`;

export class SandboxPage extends React.Component {
    render() {
        return (
            <div
                style={{
                    backgroundColor: '#2d3e5d',
                    paddingTop: '75px',
                    height: 'calc(100vh - 75px)',
                    width: '100vw'
                }}
            >
                <Page>
                    <Code>
                        <Monaco
                            width={'100%'}
                            height={'100%'}
                            language="javascript"
                            theme="vs-dark"
                            options={{
                                fontSize: 18,
                                minimap: { enabled: false },
                                cursorStyle: 'block'
                            }}
                        />
                    </Code>
                    <Output />
                    <Controls />
                </Page>
            </div>
        );
    }
}
