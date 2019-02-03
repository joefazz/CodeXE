import React from 'react';
import { Terminal } from 'xterm';
// import * as attach from '../addons/attach';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';

import '../css/xterm.css';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);

type Props = {
    container: string;
};

export default class XTerminal extends React.Component<Props> {
    term: Terminal;
    streamSocket: WebSocket;
    elementId: string;
    failures: number;
    interval?: number;
    fontSize: number;

    constructor(props: Props) {
        super(props);

        this.elementId = `terminal_hello`;
        this.failures = 0;
        this.interval = null;
        this.fontSize = 16;

        this.state = {
            command: ''
        };
    }

    componentDidMount() {
        this.term = new Terminal({
            cursorBlink: true,
            rows: 3,
            fontSize: this.fontSize
        });

        this.term.open(document.querySelector(`#${this.elementId}`));

        this.term.writeln('Ayy baby terminal here but where the connection fam');

        // @ts-ignore
        this.term.fit();
        this.term.focus();

        listenToWindowResize(() => {
            // @ts-ignore
            this.term.fit();
        });
        // this.term.fit();

        // this.term.decreaseFontSize = () => {
        //     this.term.setOption('fontSize', --this.fontSize);
        //     this.term.fit();
        // };
        // this.term.increaseFontSize = () => {
        //     this.term.setOption('fontSize', ++this.fontSize);
        //     this.term.fit();
        // };

        this.term.textarea.onkeydown = (e) => {
            console.log(e.keyCode, e.shiftKey, e.ctrlKey, e.altKey);
            // ctrl + shift + metakey + +
            if ((e.keyCode === 187 || e.keyCode === 61) && e.shiftKey && e.ctrlKey && e.altKey) {
                this.term.setOption('fontSize', ++this.fontSize);
                // @ts-ignore
                this.term.fit();
            }
            // ctrl + shift + metakey + -
            else if (
                (e.keyCode === 189 || e.keyCode === 173) &&
                e.shiftKey &&
                e.ctrlKey &&
                e.altKey
            ) {
                this.term.setOption('fontSize', --this.fontSize);
                // @ts-ignore
                this.term.fit();
            }
        };

        this._connectToSocket();
    }

    componentWillUnmount() {
        clearTimeout(this.interval);
    }

    render() {
        return (
            <div
                id={this.elementId}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}
            />
        );
    }

    _connectToSocket() {
        this.streamSocket = new WebSocket(`ws://localhost:4000/connect?id=${this.props.container}`);

        this.streamSocket.onopen = () => {
            // @ts-ignore
            this.term.attach(this.streamSocket, true);
            this.term.writeln('Attached to Socket');
        };
        this.streamSocket.onclose = () => {
            this.term.writeln('Server disconnected!');
            // this._connectToSocket();
        };
        this.streamSocket.onerror = () => {
            this.term.writeln('Server disconnected!');
            // this._connectToSocket();
        };
    }
}

function listenToWindowResize(callback: () => void) {
    var resizeTimeout: any;

    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null;
                callback();
            }, 66);
        }
    }

    window.addEventListener('resize', resizeThrottler, false);
}
