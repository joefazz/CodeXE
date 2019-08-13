import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import XTerminal from '../../components/Terminal';
import { colors } from '../../constants';
import { Button } from '../../styled/Button';
import LoadingCode from '../../components/LoadingCode';
import { Split, SplitChild } from '../../styled/Split';
import { Languages, Context } from '../../@types';
import LoadingTerm from '../../styled/LoadingTerm';
import { SocketContext } from '../../pages/_app';
const Monaco: any = dynamic(import('../../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});

type Props = {
    data: {
        containerId: string;
    };
    functions: {
        saveCode: (code: string) => void;
        readCode: (file: string) => void;
    };
};

function SandboxWidget({ data, functions }: Props) {
    const { containerId } = data;
    const { response } = useContext(SocketContext) as Context;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [code, setCode] = useState('// Pick a file from the left to start coding!');
    const [language, setLang] = useState(Languages.JS as string);
    const { saveCode, readCode } = functions;

    useEffect(() => {
        if (response.readData.code) {
            setCode(response.readData.code);
        }
    }, [response.readData.code]);

    return (
        <Split split={'vertical'} defaultSize="65%">
            <SplitChild
                split={'vertical'}
                defaultSize="85%"
                maxSize="30%"
                primary={'second'}
                onChange={(size) => setCodeWidth(size)}
            >
                <FileArea>
                    <FileWrapper>
                        {response.metaData.tree &&
                            response.metaData.tree.map((file: string) => (
                                <File
                                    key={file}
                                    onClick={() => {
                                        readCode(file);
                                        let extension = file.split('.')[1];
                                        setLang(
                                            extension === 'js'
                                                ? Languages.JS
                                                : extension === 'py'
                                                ? Languages.PYTHON
                                                : Languages.C
                                        );
                                    }}
                                >
                                    {file}
                                </File>
                            ))}
                    </FileWrapper>
                    <Button
                        primary
                        success
                        style={{
                            borderRadius: 0,
                            flex: 1
                        }}
                        onClick={() => saveCode(code)}
                    >
                        Save
                    </Button>
                </FileArea>
                <div style={{ height: '100%' }}>
                    <Monaco
                        language={language}
                        width={codeWidth}
                        height={'100%'}
                        options={{
                            fontSize: 18,
                            minimap: { enabled: false },
                            cursorStyle: 'block'
                        }}
                        onChange={(newVal: string) => setCode(newVal)}
                        value={code}
                    />
                    {/* <Selector
                        style={{ height: '5%', width: '100%' }}
                        value={language}
                        onChange={(e) => switchLanguage(e.target.value)}
                    >
                        {languageOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Selector> */}
                </div>
            </SplitChild>
            {containerId ? (
                <XTerminal containerId={containerId} bidirectional={true} />
            ) : (
                <LoadingTerm>
                    <span>Loading Container...</span>
                </LoadingTerm>
            )}
        </Split>
    );
}

// const Controls = styled.div`
//     display: flex;
//     background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
//     height: 100%;
//     width: 100%;
//     align-items: center;
//     justify-content: space-evenly;
//     flex-direction: row;
// `;

// const ControlArea = styled.div`
//     display: flex;
//     flex: 1;
//     flex-direction: column;
//     align-items: stretch;
//     height: 100%;
// `;

const FileArea = styled.section`
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: stretch;
    justify-content: flex-start;
    background-color: ${colors.backgroundSuperDark};
`;

const FileWrapper = styled.div`
    display: flex;
    flex: 20;
    flex-direction: column;
`;

const File = styled.span`
    color: white;
    padding: 3px 5px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    cursor: pointer;

    :hover {
        background-color: ${colors.backgroundBlue};
    }
`;

export default SandboxWidget;
