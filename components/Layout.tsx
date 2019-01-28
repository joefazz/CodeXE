import React from 'react';
import Link from 'next/link';
import '../App.css';
import { Button } from '../styled/Button';
import { Logo } from '../styled/Logo';
import { Header } from '../styled/Header';
import { Avatar } from '../styled/Avatar';
import { NavLink } from '../styled/NavLink';
import styled from 'styled-components';

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
    font-family: 'Josefin Sans', sans-serif;
    border-radius: 5px;
    margin-left: 3%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 5px;
    border: 1px solid white;
`;

const ContainerStatus = styled.div`
    margin-left: 5px;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background-color: ${(props: { color: string }) => props.color};
    animation: radar infinite 5s linear;

    @keyframes radar {
        0% {
            box-shadow: 0px 0px 2px ${(props: { color: string }) => props.color};
        }
        50% {
            box-shadow: 0px 0px 7px ${(props: { color: string }) => props.color};
        }
        100% {
            box-shadow: 0px 0px 2px ${(props: { color: string }) => props.color};
        }
    }
`;

type Props = {
    isLoggedIn: boolean;
};

class Layout extends React.PureComponent<Props> {
    render() {
        return (
            <RootPage>
                <Header>
                    <LeftWrapper>
                        <Link href="/">
                            <Logo>OpenStudy</Logo>
                        </Link>
                        <StatusWrapper>
                            <span style={{ paddingTop: '2px' }}>Connection Status:</span>{' '}
                            <ContainerStatus color={'green'} />
                        </StatusWrapper>
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
                        <Link href="/profile">
                            <NavLink>Profile</NavLink>
                        </Link>
                        {this.props.isLoggedIn ? (
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
                    {this.props.children}
                </div>
            </RootPage>
        );
    }
}

export default Layout;
