import React from 'react';
import { Terminal } from 'xterm';
// import * as attach from '../addons/attach';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';

import '../css/xterm.css';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);

type Props = {
    containerId: string;
    bidirectional: boolean;
    onConnectText?: string[] | string;
    output?: string;
    customStream?: WebSocket | string;
};

export default class XTerminal extends React.Component<Props> {
    term: Terminal & {
        attach?: (socket: WebSocket, isBidirectional: boolean, isBuffered: boolean) => void;
        detach?: (socket: WebSocket) => void;
        fit?: () => void;
    };
    streamSocket: WebSocket;
    exerciseSocket: WebSocket;
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

        this.term.fit();
        this.term.focus();

        // this.term.decreaseFontSize = () => {
        //     this.term.setOption('fontSize', --this.fontSize);
        //     this.term.fit();
        // };
        // this.term.increaseFontSize = () => {
        //     this.term.setOption('fontSize', ++this.fontSize);
        //     this.term.fit();
        // };

        this.term.textarea.onkeydown = (e) => {
            // ctrl + shift + metakey + +
            if ((e.keyCode === 187 || e.keyCode === 61) && e.shiftKey && e.ctrlKey && e.altKey) {
                this.term.setOption('fontSize', ++this.fontSize);
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
                this.term.fit();
            }
        };

        this._connectToMainSocket();
    }

    componentDidUpdate(prev: Props) {
        this.term.fit();

        if (this.props.output !== prev.output && this.props.output !== '') {
            console.log(this.props.output);
            this.term.writeln('');
            this.term.write('> ');
            this.term.write(this.props.output);
            this.term.writeln('');
        }

        if (this.props.customStream !== '' && this.props.customStream !== undefined) {
            this._connectToExerciseSocket(this.props.customStream as WebSocket);
        }
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
                    height: '100%',
                    backgroundColor: 'black'
                }}
            />
        );
    }

    _connectToExerciseSocket(socket: WebSocket) {
        this.term.detach(this.streamSocket);
        console.log(this.term.detach);

        this.exerciseSocket = socket as WebSocket;
        console.log('Connecting to custom stream...');

        this.exerciseSocket.onopen = () => {
            this.term.writeln('');
            this.term.writeln('');
            this.term.attach(this.exerciseSocket, true, true);
        };

        this.exerciseSocket.onclose = () => {
            this.term.detach(this.exerciseSocket);
            this.term.writeln('');
            this.term.writeln('Code execution complete, returning to container...');
            this.term.writeln('');
            this.term.writeln('>');

            this._connectToMainSocket(false);
        };

        this.exerciseSocket.onerror = () => {
            this.term.writeln('EXERCISE CRASHED AND BURNED');
        };
    }

    _connectToMainSocket(showLogs: boolean = true) {
        this.streamSocket = new WebSocket(
            `ws://localhost:4000/connect?id=${this.props.containerId}&bidirectional=${
                this.props.bidirectional
            }&logs=${showLogs}`
        );

        this.streamSocket.onopen = () => {
            this.term.attach(this.streamSocket, true, true);
            if (this.props.onConnectText && Array.isArray(this.props.onConnectText)) {
                this.props.onConnectText.forEach((line) => {
                    this.term.writeln(' ');
                    this.term.writeln(' ');
                    this.term.write(line);
                });
            } else {
                // this.term.writeln(this.props.onConnectText);
            }
            // this.term.writeln(
            //     'If you want to save your work, Git is installed so I recommend making a repo and pushing to it 🙂'
            // );
            // this.term.writeln(`Press 'Enter' to start`);
        };
        this.streamSocket.onclose = () => {
            // this.term.clear();
            console.log('Socket closed');

            // this._connectToSocket();
        };
        this.streamSocket.onerror = () => {
            // this.term.clear();
            this.term.writeln('SOCKET CRASHED AND BURNT!');
            // this._connectToSocket();
        };
    }
}
