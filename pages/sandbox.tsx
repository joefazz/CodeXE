import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { SocketContext } from '../pages/_app';
import { Context, MessageTypes, Languages } from '../@types';
import SandboxWidget from '../screens/sandbox';

function SandboxPage() {
    const { socket, id } = useContext(SocketContext) as Context;

    function saveCode(language: string, code: string) {
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
        <Layout isLoggedIn={false}>
            <SandboxWidget data={{ containerId: id }} functions={{ saveCode }} />
        </Layout>
    );
}

export default SandboxPage;
