import styled from 'styled-components';
import { fonts, colors } from '../constants';

export const H1 = styled.h1`
    font-family: ${fonts.display};
    background-color: ${colors.mainBlue};
    color: white;
    padding: 7px;
    margin: 7px;
    border-radius: 6px;
    box-shadow: 2px 3px 5px black;
`;
