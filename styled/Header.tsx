import styled from 'styled-components';

export const Header = styled.header`
    display: flex;
    width: calc(100vw - 30px);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #282c34;
    box-shadow: 0 3px 3px black;
    min-height: 75px;
    max-height: 75px;
    padding: 0 15px;
    position: fixed;
`;
