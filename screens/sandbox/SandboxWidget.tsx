import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import XTerminal from '../../components/Terminal';
import { colors, languageOptions } from '../../constants';
import { Button } from '../../styled/Button';
import LoadingCode from '../../components/LoadingCode';
import { Split } from '../../styled/Split';
import { ReactSetter } from 'opentypes';
import { ValueType } from 'react-select/lib/types';
const Monaco: any = dynamic(import('../../components/Monaco') as any, {
    ssr: false,
    loading: LoadingCode
});

type Props = {
    data: {
        codeWidth: string | number;
        codeHeight: string | number;
        code: string;
        language: { value: string; label: string };
        containerId: string;
    };
    setters: {
        setCode: ReactSetter<string>;
        setCodeWidth: ReactSetter<number>;
        setCodeHeight: ReactSetter<number>;
        setLang: ReactSetter<ValueType<{ value: string; label: string }>>;
    };
    functions: {
        saveCode: () => void;
    };
};

function SandboxWidget({ data, setters, functions }: Props) {
    const { code, codeWidth, codeHeight, language, containerId } = data;
    const { setCode, setCodeHeight, setCodeWidth, setLang } = setters;
    const { saveCode } = functions;

    return (
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
                            options={languageOptions}
                            menuPlacement={'auto'}
                            value={language}
                            onChange={(opt) => setLang(opt)}
                        />
                    </ControlArea>
                </Controls>
            </Split>
            <XTerminal containerId={containerId} bidirectional={true} />
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
