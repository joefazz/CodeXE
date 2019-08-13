//@ts-ignore
import { Terminal } from 'xterm';

Object.defineProperty(exports, '__esModule', { value: true });

function attach(term: any, socket: WebSocket, bidirectional: boolean, buffered: boolean) {
    bidirectional = typeof bidirectional === 'undefined' ? true : bidirectional;
    term.socket = socket;
    term._flushBuffer = function() {
        term.write(term._attachSocketBuffer);
        term._attachSocketBuffer = null;
    };
    term._pushToBuffer = function(data: any) {
        if (term._attachSocketBuffer) {
            term._attachSocketBuffer += data;
        } else {
            term._attachSocketBuffer = data;
            setTimeout(term._flushBuffer, 10);
        }
    };
    let myTextDecoder: any;

    term._getMessage = function(ev: any) {
        let str;

        if (typeof ev.data === 'object') {
            if (ev.data instanceof ArrayBuffer) {
                if (!myTextDecoder) {
                    myTextDecoder = new TextDecoder();
                }
                str = myTextDecoder.decode(ev.data);
            } else {
                throw new Error('TODO: handle Blob?');
            }
        }
        if (buffered) {
            term._pushToBuffer(str || ev.data);
        } else {
            term.write(str || ev.data);
        }
    };
    term._sendData = function(data: any) {
        if (socket.readyState !== 1) {
            return;
        }
        let encoded = encodeURI(data);

        if (encoded === '%1B%5B1;11D') return;
        if (encoded === '%1B%5B1;11C') return;
        socket.send(data);
    };
    socket.addEventListener('message', term._getMessage);
    if (bidirectional) {
        term.on('data', term._sendData);
    }
    socket.addEventListener('close', term.detach.bind(term, socket));
    socket.addEventListener('error', term.detach.bind(term, socket));
}
exports.attach = attach;
function detach(term: any, socket: WebSocket) {
    term.off('data', term._sendData);
    socket = typeof socket === 'undefined' ? term.socket : socket;
    if (socket) {
        socket.removeEventListener('message', term._getMessage);
    }
    delete term.socket;
}
exports.detach = detach;
function apply(terminalConstructor: any) {
    terminalConstructor.prototype.attach = function(
        socket: WebSocket,
        bidirectional: boolean,
        buffered: boolean
    ) {
        return attach(this, socket, bidirectional, buffered);
    };
    terminalConstructor.prototype.detach = function(socket: WebSocket) {
        return detach(this, socket);
    };
}
exports.apply = apply;
