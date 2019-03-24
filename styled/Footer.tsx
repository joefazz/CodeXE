import styled from 'styled-components';
import { colors, fonts } from '../constants';

export const Footer = styled.div`
    grid-area: footer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${colors.backgroundDarkTranslucent};

    border-top-left-radius: 9px;
    color: white;
    font-family: ${fonts.body};
    padding: 0 20px;
    font-size: 1.2rem;
`;
