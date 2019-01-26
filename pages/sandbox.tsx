import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import SplitPane from 'react-split-pane';
const Monaco: any = dynamic(import('../components/Monaco') as any, {
    ssr: false
});

export const Controls = styled.div`
    display: flex;
    background-color: palegoldenrod;
    height: 100%;
    width: 100%;
`;

export const Output = styled.div`
    display: flex;
    background-color: purple;
    height: 100%;
    width: 100%;
`;

export const Split = styled(SplitPane)`
    height: calc(100% - 75px) !important;
    .Resizer {
        background: white;
        opacity: 0.2;
        z-index: 1;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -moz-background-clip: padding;
        -webkit-background-clip: padding;
        background-clip: padding-box;
    }

    .Resizer:hover {
        -webkit-transition: all 2s ease;
        transition: all 2s ease;
    }

    .Resizer.horizontal {
        height: 11px;
        margin: -5px 0;
        border-top: 5px solid rgba(255, 255, 255, 0);
        border-bottom: 5px solid rgba(255, 255, 255, 0);
        cursor: row-resize;
        width: 100%;
    }

    .Resizer.horizontal:hover {
        border-top: 5px solid rgba(255, 255, 255, 0.5);
        border-bottom: 5px solid rgba(255, 255, 255, 0.5);
    }

    .Resizer.vertical {
        width: 11px;
        margin: 0 -5px;
        border-left: 5px solid rgba(255, 255, 255, 0);
        border-right: 5px solid rgba(255, 255, 255, 0);
        cursor: col-resize;
    }

    .Resizer.vertical:hover {
        border-left: 5px solid rgba(255, 255, 255, 0.5);
        border-right: 5px solid rgba(255, 255, 255, 0.5);
    }
    .Resizer.disabled {
        cursor: not-allowed;
    }
    .Resizer.disabled:hover {
        border-color: transparent;
    }
`;

export default class SandboxPage extends React.Component {
    state = {
        codeWidth: '100%'
    };
    render() {
        return (
            <Layout isLoggedIn={false}>
                <Split
                    split={'vertical'}
                    defaultSize="50%"
                    onChange={(size) => this.setState({ codeWidth: size })}
                >
                    <Monaco
                        language="javascript"
                        width={this.state.codeWidth}
                        options={{
                            fontSize: 18,
                            minimap: { enabled: false },
                            cursorStyle: 'block'
                        }}
                    />
                    <Split split={'horizontal'} defaultSize="75%">
                        <Output />
                        <Controls />
                    </Split>
                </Split>
            </Layout>
        );
    }
}
