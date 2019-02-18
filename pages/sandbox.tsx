import React, { useContext, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import XTerminal from '../components/Terminal';
import { SocketContext } from './_app';
import { Context, MessageTypes, Languages } from '../types';
import { colors } from '../constants';
import { Button } from '../styled/Button';
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

function SandboxPage() {
    const { socket, id } = useContext(SocketContext) as Context;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [codeHeight, setCodeHeight] = useState<string | number>('100%');
    const [code, setCode] = useState('// Enter code');
    const [language, setLang] = useState({ value: Languages.JS, label: 'javascript' });

    const languageOpts = [
        { value: Languages.JS, label: 'JavaScript' },
        { value: Languages.PYTHON, label: 'Python' },
        { value: Languages.C, label: 'C/C++' }
    ];

    // Not really sure if i want to implement running code in sandbox?
    // useEffect(() => {
    //     if (response.metaData.saveInfo.succeed) {
    //     }
    // }, [response.metaData.saveInfo.timestamp]);

    function saveCode() {
        const filename =
            language.value === Languages.JS
                ? 'index.js'
                : language.value === Languages.PYTHON
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
        <Layout isLoggedIn={false}>
            <Split split={'vertical'} defaultSize="50%" onChange={(size) => setCodeWidth(size)}>
                <Split
                    split={'horizontal'}
                    defaultSize="95%"
                    maxSize="95%"
                    onChange={(size) => setCodeHeight(size)}
                >
                    <Monaco
                        language={language.value}
                        width={codeWidth}
                        height={codeHeight}
                        options={{
                            fontSize: 18,
                            minimap: { enabled: false },
                            cursorStyle: 'block'
                        }}
                        onChange={(newVal: string) => setCode(newVal)}
                        value={code}
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
                                onClick={() => saveCode()}
                            >
                                Save
                            </Button>
                        </ControlArea>
                        <ControlArea>
                            <Select
                                options={languageOpts}
                                menuPlacement={'auto'}
                                value={language}
                                onChange={(opt) =>
                                    // @ts-ignore
                                    setLang(opt)
                                }
                            />
                        </ControlArea>
                    </Controls>
                </Split>
                <XTerminal containerId={id} bidirectional={true} />
            </Split>
        </Layout>
    );
}

export default SandboxPage;
