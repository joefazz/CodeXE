import { handleMessage } from '../websockets';
import { MessageTypes } from '../../@types';

describe('Test Clientside WebSockets', () => {
    test('Message Receive', () => {
        const MOCK_EVENT: MessageEvent = new MessageEvent('test', {
            data: JSON.stringify({ type: MessageTypes.CONTAINER_RESUME, data: {} })
        });

        const MOCK_STATE = {};

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).not.toBeUndefined();
    });
});
