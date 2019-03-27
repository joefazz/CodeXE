import React, { useContext, useEffect } from 'react';
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

    function readCode(file: string) {
        socket.send(JSON.stringify({ type: MessageTypes.CODE_READ, data: { id, file } }));
    }

    useEffect(() => {
        if (socket) {
            socket.send(JSON.stringify({ type: 'Container.TreeRead', data: { id } }));
        }
    }, [socket]);

    return (
        <Layout isLoggedIn={false}>
            <SandboxWidget data={{ containerId: id }} functions={{ saveCode, readCode }} />
        </Layout>
    );
}

export default SandboxPage;
