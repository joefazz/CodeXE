import styled from 'styled-components';
import { colors, fonts } from '../constants';

export const Selector = styled.select`
    color: white;
    background-color: ${colors.backgroundDark};
    font-family: ${fonts.body};
    padding: 7px 0;
    border-color: palevioletred;
`;
