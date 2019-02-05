import { Languages, MessageTypes } from '../types';

type Params = {
    id: string;
    code: string;
    language: Languages;
    socket: WebSocket;
};
export function runCode(params: Params) {
    const { id, code, language, socket } = params;

    let message: { code: string; id: string; repl: string } = {
        id: id,
        code,
        repl: 'node'
    };

    switch (language) {
        case Languages.JS:
            message.repl = 'node';
            break;
        case Languages.PYTHON:
            message.repl = 'python3';
            break;
        case Languages.C:
            message.repl = 'gcc';
            break;
        default:
            return;
    }

    console.log(message);

    socket.send(JSON.stringify({ type: MessageTypes.CONTAINER_EXEC, data: message }));
}
