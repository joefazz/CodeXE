import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { MessageTypes } from '../@types';
import { handleMessage } from '../functions/websockets';

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
        activityId: '',
        response: {
            readData: {},
            metaData: { saveInfo: {} },
            writeData: { output: 'Output' }
        }
    };

    componentDidMount() {
        this.socket = new WebSocket('ws://localhost:4000/');

        this.socket.onopen = () => {
            console.log('Socket Opened');
        };

        this.socket.onmessage = (event) => this.setState(handleMessage(event, this.state));

        this.socket.onclose = function() {
            // socket.send('container.end');
            console.log('WebSocket has been closed');
        };
        this.socket.onerror = function(event) {
            console.log('Error', event);
        };
    }

    // TODO: GET THIS WORKING FFS
    componentWillUnmount() {
        this.socket.send(
            JSON.stringify({ message: 'Container.Stop', data: { id: this.state.id } })
        );
        this.socket.close();
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head>
                    <title>CodeXE</title>
                    <link
                        href="https://fonts.googleapis.com/css?family=Cantarell|Arvo"
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
