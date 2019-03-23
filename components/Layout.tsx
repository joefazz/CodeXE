import React, { useContext, ReactChild } from 'react';
import Link from 'next/link';
import '../css/App.css';
import { Button } from '../styled/Button';
import { Logo } from '../styled/Logo';
import { Header } from '../styled/Header';
import { Avatar } from '../styled/Avatar';
import { NavLink } from '../styled/NavLink';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { fonts } from '../constants';
import { SocketContext } from '../pages/_app';
import { Context, MessageTypes } from '../@types';
import usePageVisibility from '../functions/usePageVisibility';

const RootPage = styled.div`
    min-height: 100vh;
    min-width: 100vh;
`;

const LeftWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 40%;
`;

const StatusWrapper = styled.div`
    background-color: white;
    font-family: ${fonts.body}, sans-serif;
    border-radius: 5px;
    margin-left: 3%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 5px;
    border: 1px solid white;
    cursor: help;
    box-shadow: 2px 2px 3px black;
`;

const ContainerStatus = styled.div`
    margin-left: 5px;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background-color: ${(props: { color: string }) => props.color};
    animation: radar infinite 2s linear;

    @keyframes radar {
        0% {
            box-shadow: 0px 0px 0px ${(props: { color: string }) => props.color};
        }
        50% {
            box-shadow: 0px 0px 4px ${(props: { color: string }) => props.color};
        }
        100% {
            box-shadow: 0px 0px 0px ${(props: { color: string }) => props.color};
        }
    }
`;

type Props = {
    isLoggedIn: boolean;
    children: ReactChild;
};

/**
 * HOOKS BABBBBBYYYYYYYYY
 * @param props
 */
function Layout(props: Props) {
    const { status, containerName, socket, id } = useContext(SocketContext) as Context;

    // @ts-ignore
    if (process.browser) {
        function onHidden() {
            if (socket) {
                socket.send(JSON.stringify({ type: MessageTypes.CONTAINER_PAUSE, data: { id } }));
            }
        }

        function onVisible() {
            if (socket) {
                socket.send(JSON.stringify({ type: MessageTypes.CONTAINER_RESUME, data: { id } }));
            }
        }

        usePageVisibility(onHidden, onVisible, [socket]);
    }

    return (
        <RootPage>
            <Header>
                <LeftWrapper>
                    <Link href="/">
                        <Logo>Codexe</Logo>
                    </Link>
                    <Popup
                        trigger={() => (
                            <StatusWrapper>
                                <span style={{ paddingTop: '2px' }}>Connection Status:</span>{' '}
                                <ContainerStatus
                                    color={
                                        status === 'disconnected'
                                            ? 'red'
                                            : status === 'idle'
                                            ? 'orange'
                                            : 'green'
                                    }
                                />
                            </StatusWrapper>
                        )}
                        contentStyle={{
                            fontFamily: fonts.display
                        }}
                        position={'right center'}
                        closeOnDocumentClick
                    >
                        <span>
                            {containerName === ''
                                ? 'There was a problem'
                                : status === 'idle'
                                ? `${containerName} has been paused while you do an exercise`
                                : `Connected to: ${containerName}`}
                        </span>
                    </Popup>
                </LeftWrapper>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        width: '40%'
                    }}
                >
                    <Link href="/sandbox">
                        <NavLink>Sandbox</NavLink>
                    </Link>
                    <Link href="/exercises">
                        <NavLink>Exercises</NavLink>
                    </Link>
                    {/* <Link href="/profile">
                        <NavLink>Profile</NavLink>
                    </Link> */}
                    {props.isLoggedIn ? (
                        <Avatar src="https://pbs.twimg.com/profile_images/1026402265190617089/zMyg2gvB_400x400.jpg" />
                    ) : (
                        <Button>Sign Up</Button>
                    )}
                </div>
            </Header>
            <div
                style={{
                    backgroundColor: '#2d3e5d',
                    paddingTop: '75px',
                    height: 'calc(100vh - 75px)',
                    width: '100vw'
                }}
            >
                {props.children}
            </div>
        </RootPage>
    );
}

export default Layout;
