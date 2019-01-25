import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }: NextAppContext) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head>
                    <title>OpenStudy</title>
                    <link
                        href="https://fonts.googleapis.com/css?family=Josefin+Sans|Raleway|Arvo"
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
                <Component {...pageProps} />
            </Container>
        );
    }
}
