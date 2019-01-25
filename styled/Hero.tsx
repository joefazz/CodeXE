import styled, { css } from 'styled-components';
import { fonts } from '../constants';

export const Hero = styled.div`
    font-family: ${fonts.display};
    background-color: dodgerblue;
    text-align: center;
    font-size: 42px;
    color: white;
    font-weight: bold;
    border-radius: 3px;
    border: 1px solid cornflowerblue;
    padding: 10px 0;
    box-shadow: 0 4px 8px black;

    ${(props: { secondary?: boolean }) =>
        props.secondary &&
        css`
            background-color: #3ca56e;
            border: 1px solid darkgreen;
        `};
`;
