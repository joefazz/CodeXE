import { Languages } from './@types';

export const colors = {
    mainBlue: 'dodgerblue',
    mainGreen: '#3ca56e',
    backgroundDark: '#282c34',
    backgroundBlue: '#2d3e5d',
    backgroundDarkTranslucent: 'rgba(40,44,52, 0.7)'
};

export const fonts = {
    display: "'Arvo', serif",
    body: "'Josefin Sans', sans-serif"
};

export const languageOptions: { value: string; label: string }[] = [
    { value: Languages.JS, label: 'JavaScript' },
    { value: Languages.PYTHON, label: 'Python' },
    { value: Languages.C, label: 'C/C++' }
];

export const DOMAIN = `https://midgard.codexe.run`;
