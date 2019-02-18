import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { MessageTypes } from '../types';

export const SocketContext = React.createContext({});

export default class MyApp extends App {
    containerInfo: any;
    socket: WebSocket;

    static async getInitialProps({ Component, ctx }: NextAppContext) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    state = {
        status: 'disconnected',
        containerName: '',
        id: '',
        response: { readData: {}, metaData: {}, writeData: {} }
    };

    componentDidMount() {
        this.socket = new WebSocket('ws://localhost:4000/');

        this.socket.onopen = () => {
            console.log('Socket Opened');
            // socket.send(JSON.stringify({ type: 'container.start' }));
        };

        this.socket.onmessage = (event) => {
            const { type, data }: { type: MessageTypes; data: any } = JSON.parse(event.data);
            console.log('Message Recieved!', 'Type: ' + type);

            switch (type) {
                case MessageTypes.CONTAINER_START:
                    console.log('Container Started');
                    const { name, info } = data;
                    this.setState({
                        containerName: name,
                        status: 'connected',
                        id: info.Config.Hostname
                    });
                    break;
                case MessageTypes.CONTAINER_EXEC:
                    console.log('Execution returned');
                    this.setState({
                        response: { ...this.state.response, writeData: data }
                    });
                    break;
                case MessageTypes.CONTAINER_READ:
                    console.log('Code read');
                    this.setState({
                        response: { ...this.state.response, readData: data }
                    });
                    break;
                case MessageTypes.CONTAINER_STOP:
                    console.log('stopped container');
                    break;
                case MessageTypes.EXERCISE_CONNECT:
                    this.setState({
                        response: { ...this.state.response, metaData: data }
                    });
                    break;
                case MessageTypes.EXERCISE_EXEC:
                    console.log('Exercise Execution Returned');
                    this.setState({
                        response: { ...this.state.response, writeData: data }
                    });
                    break;
                case MessageTypes.CODE_SAVE:
                    console.log('Code save returned');
                    this.setState({
                        response: {
                            ...this.state.response,
                            metaData: { ...this.state.response.metaData, didSave: data.success }
                        }
                    });
                    break;
                default:
                    console.log('other type', data);
            }
        };

        this.socket.onclose = function() {
            // socket.send('container.end');
            console.log('WebSocket has been closed');
        };
        this.socket.onerror = function(event) {
            console.log('Error', event);
        };
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head>
                    <title>OpenStudy</title>
                    <link
                        href="https://fonts.googleapis.com/css?family=Josefin+Sans|Arvo"
                        rel="stylesheet"
                    />
                    <link
                        rel="shortcut icon"
                        href="/static/images/favicon.ico"
                        type="image/x-icon"
                    />
                    <link rel="icon" href="/static/images/favicon.ico" type="image/x-icon" />
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"
                    />
                </Head>
                <SocketContext.Provider value={{ ...this.state, socket: this.socket }}>
                    <Component {...pageProps} />
                </SocketContext.Provider>
            </Container>
        );
    }
}
