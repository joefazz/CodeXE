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

        // @ts-ignore
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

    // componentDidUpdate(prevProps: Props) {
    //     if (prevProps.termHeight !== this.props.termHeight) {
    //         // @ts-ignore
    //         this.term.fit();
    //     }
    // }

    componentDidUpdate() {
        // @ts-ignore
        this.term.fit();
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

    _connectToSocket() {
        this.streamSocket = new WebSocket(
            `ws://localhost:4000/connect?id=${this.props.containerId}&bidirectional=${
                this.props.bidirectional
            }`
        );

        this.streamSocket.onopen = () => {
            // @ts-ignore
            this.term.attach(this.streamSocket, true);
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
            this.term.clear();
            this.term.writeln('Server disconnected!');
            // this._connectToSocket();
        };
        this.streamSocket.onerror = () => {
            this.term.clear();
            this.term.writeln('Server disconnected!');
            // this._connectToSocket();
        };
    }
}
