import { handleMessage } from '../websockets';
import { MessageTypes } from '../../@types';

const MOCK_STATE = {};

describe('Test Client-Side WebSockets', () => {
    test('Message Receive', () => {
        const MOCK_EVENT: MessageEvent = new MessageEvent('test', {
            data: JSON.stringify({ type: MessageTypes.CONTAINER_RESUME, data: {} })
        });

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).not.toBeUndefined();
    });
});
