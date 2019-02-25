import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import { SocketContext } from '../../pages/_app';
import { Context, MessageTypes, Languages } from '../../@types';
import SandboxWidget from './SandboxWidget';

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
            <SandboxWidget
                data={{ codeWidth, codeHeight, languageOpts, containerId: id, language, code }}
                setters={{ setCode, setCodeWidth, setCodeHeight, setLang }}
                functions={{ saveCode }}
            />
        </Layout>
    );
}

export default SandboxPage;
