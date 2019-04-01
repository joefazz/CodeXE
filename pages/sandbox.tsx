import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { SocketContext } from '../pages/_app';
import { Context, MessageTypes } from '../@types';
import SandboxWidget from '../screens/sandbox';

function SandboxPage() {
    const { socket, id } = useContext(SocketContext) as Context;

    const [file, setCurrentFile] = useState('index.js');

    function saveCode(code: string) {
        socket.send(
            JSON.stringify({
                type: MessageTypes.CODE_SAVE,
                data: {
                    id,
                    file, // this depends on lang
                    code
                }
            })
        );
    }

    function readCode(file: string) {
        setCurrentFile(file);
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
