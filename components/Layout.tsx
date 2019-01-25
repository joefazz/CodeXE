import React, { Component } from 'react';
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

class Layout extends Component {
    render() {
        return (
            <RootPage>
                <Header>
                    <Link href="/">
                        <Logo>OpenStudy</Logo>
                    </Link>
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
                        <Button>Sign Up</Button>
                        <Avatar src="https://pbs.twimg.com/profile_images/1026402265190617089/zMyg2gvB_400x400.jpg" />
                    </div>
                </Header>
                <div
                    style={{
                        backgroundColor: '#2d3e5d',
                        paddingTop: '100px',
                        height: 'calc(100vh - 100px)',
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
