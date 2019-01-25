import styled, { css } from 'styled-components';
import { fonts, colors } from '../constants';

type Props = {
    raised?: boolean;
    primary?: boolean;
    success?: boolean;
};

export const Button = styled.button`
    background: transparent;
    font-family: ${fonts.display};
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
    padding: 0.25em 1em;
    font-size: 1.2rem;
    cursor: pointer;
    transition: linear 0.2s;

    ${(props: Props) =>
        props.raised &&
        css`
            box-shadow: 0 3px 7px black;

            :active {
                box-shadow: 0 0 0;
            }
        `}

    ${(props: Props) =>
        props.primary
            ? css`
                  background: palevioletred;
                  color: white;
              `
            : css`
                  :hover {
                      border-color: white;
                      color: white;
                      transition: linear 0.2s;
                  }
              `}

    ${(props: Props) =>
        props.success &&
        css`
            background-color: ${colors.mainGreen};
            color: white;
            padding: 5px 0;
            border: none;
            box-shadow: 0 2px 5px black;
            width: 100%;
        `}
`;
