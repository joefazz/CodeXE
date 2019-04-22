import React from 'react';
import styled from 'styled-components';
import { H1 } from '../styled/H1';

const CodeLoad = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #1e1e1e;
`;

const VSLoader = styled.img`
    width: 20%;
    background-color: transparent;
    margin-bottom: 5%;
    animation: transparent 5s cubic-bezier(0.19, 1, 0.22, 1) infinite;

    @keyframes transparent {
        from {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;

function LoadingCode(props) {
    return (
        <CodeLoad>
            <VSLoader src="/static/images/vscode-b&w.png" />
            <H1>Loading Code...</H1>
        </CodeLoad>
    );
}

export default LoadingCode;
