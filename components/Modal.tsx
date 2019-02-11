import React from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import { colors, fonts } from '../constants';
import { Button } from '../styled/Button';

type Props = {
    trigger: JSX.Element;
    children: JSX.Element;
    title: string;
    onConfirm: () => void;
};

const StyledModal = styled.div`
    display: flex;
    flex-direction: column;
    height: 70vh;
    align-items: stretch;
    background-color: ${colors.backgroundDark};
    border-radius: 5px;
    box-shadow: 0 0 3px black;
    color: white;
    font-family: ${fonts.body};
    color: white;
`;

const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    padding-left: 8px;
    border-bottom: 1px solid white;
    font-family: ${fonts.display};
    font-size: 3rem;
    flex: 1;
`;

const StyledContent = styled.div`
    flex: 6;
`;

const StyledFooter = styled.footer`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    flex: 1;
`;

function Modal(props: Props) {
    return (
        <Popup trigger={props.trigger} modal closeOnDocumentClick>
            {(close) => (
                <StyledModal>
                    <StyledHeader>{props.title}</StyledHeader>
                    <StyledContent>{props.children}</StyledContent>
                    <StyledFooter>
                        <Button primary onClick={() => props.onConfirm}>
                            Confirm
                        </Button>
                        <Button onClick={() => close()}>Cancel</Button>
                    </StyledFooter>
                </StyledModal>
            )}
        </Popup>
    );
}

export default Modal;
