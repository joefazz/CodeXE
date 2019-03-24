import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import XTerminal from '../../components/Terminal';
import { colors, languageOptions } from '../../constants';
import { Button } from '../../styled/Button';
import LoadingCode from '../../components/LoadingCode';
import { Split } from '../../styled/Split';
import { Languages } from '../../@types';
import { Selector } from '../../styled/Selector';
import LoadingTerm from '../../styled/LoadingTerm';
const Monaco: any = dynamic(import('../../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});

type Props = {
    data: {
        containerId: string;
    };
    functions: {
        saveCode: (language: string, code: string) => void;
    };
};

function SandboxWidget({ data, functions }: Props) {
    const { containerId } = data;

    const [codeWidth, setCodeWidth] = useState<string | number>('100%');
    const [codeHeight, setCodeHeight] = useState<string | number>('100%');
    const [code, setCode] = useState('// Enter code');
    const [language, setLang] = useState(Languages.JS as string);
    const { saveCode } = functions;

    function switchLanguage(newLang: string) {
        switch (newLang) {
            case Languages.JS:
                setCode('// Write JavaScript');
                break;
            case Languages.PYTHON:
                setCode(`# Write Python`);
                break;
            case Languages.C:
                setCode(
                    `// Write CLang
#include<stdio.h>

int main(void) {
    printf("Hello world");
}`
                );
                break;
        }

        setLang(newLang);
    }

    return (
        <Split split={'vertical'} defaultSize="50%" onChange={(size) => setCodeWidth(size)}>
            <Split
                split={'horizontal'}
                defaultSize="95%"
                maxSize="95%"
                onChange={(size) => setCodeHeight(size)}
            >
                <Monaco
                    language={language}
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
                            onClick={() => saveCode(language, code)}
                        >
                            Save
                        </Button>
                    </ControlArea>
                    <ControlArea>
                        <Selector value={language} onChange={(e) => switchLanguage(e.target.value)}>
                            {languageOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </Selector>
                    </ControlArea>
                </Controls>
            </Split>
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

export default SandboxWidget;
