/* eslint-env: jest */

import React from 'react';

// @ts-ignore
import preloadAll from 'jest-next-dynamic';

import App from '..';
import { render } from 'react-testing-library';
import { SocketContext } from '../_app';
import { CONTEXT_DEFAULT } from '../../constants';

// describe('Renders the code editor', () => {
//     it('Shows the code editor', async () => {
//         const { getByTestId } = render(
//             <SocketContext.Provider value={CONTEXT_DEFAULT}>
//                 <SocketContext.Consumer>{() => <App />}</SocketContext.Consumer>
//             </SocketContext.Provider>
//         );

//         await waitForElement(() => getByTestId('monaco'), { timeout: 1000 });

//         expect(getByTestId('monaco')).not.toBeNull();
//     });
// });

// describe('Code Editor Tests', () => {
//     it('Renders', async () => {
//         const { getByTestId } = render(<Monaco />);

//         expect(getByTestId('monaco')).not.toBeNull();
//     });
// });

describe('Home Page Snapshot', () => {
    it('Should match Snapshot', () => {
        const { asFragment } = render(
            <SocketContext.Provider value={CONTEXT_DEFAULT}>
                <SocketContext.Consumer>{() => <App />}</SocketContext.Consumer>
            </SocketContext.Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
