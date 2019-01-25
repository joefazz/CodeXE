import styled, { css } from 'styled-components';

type Props = { large?: boolean; medium?: boolean; small?: boolean };

export const Avatar = styled.img`
    border: 1px solid white;
    box-shadow: 0 0 3px darkgrey;

    ${(props: Props) =>
        props.large
            ? css`
                  width: 100px;
                  height: 100px;
                  border-radius: 50px;
              `
            : props.small
            ? css`
                  width: 30px;
                  height: 30px;
                  border-radius: 15px;
              `
            : css`
                  width: 50px;
                  height: 50px;
                  border-radius: 25px;
              `}
`;
