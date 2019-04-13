import { handleMessage } from '../WebSockets';
import { MessageTypes } from '../../@types';

const MOCK_STATE = {};

function makeEvent(type: string, data: object | string) {
    return new MessageEvent('test', { data: JSON.stringify({ type, data }) });
}

describe('Test Message Receive WebSockets', () => {
    test('Container Pause', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_PAUSE, {});

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Container Resume', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_RESUME, {});

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Container Start', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_START, {
            name: 'Tester',
            info: { Config: { Hostname: 'Tester' } }
        });

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();

        const TEMP_STATE = { containerName: '', id: '' };

        expect(handleMessage(MOCK_EVENT, TEMP_STATE)).toMatchSnapshot();
    });

    test('Container Exec', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_EXEC, 'Hello World');

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Container Read', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_READ, { code: '// Hello' });

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Stop Container', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_STOP, {});

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Connect to Exercise', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.EXERCISE_CONNECT, 'activity_id');

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Stop Exercise', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.EXERCISE_STOP, {});

        expect(handleMessage(MOCK_EVENT, MOCK_STATE)).toMatchSnapshot();
    });

    test('Code Saved', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CODE_SAVE, {
            success: true,
            time: 1555155949202
        });

        const TEMP_STATE = { response: { metaData: {} } };

        expect(handleMessage(MOCK_EVENT, TEMP_STATE)).toMatchSnapshot();
    });

    test('Code Read', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CODE_READ, { code: '// Hello' });

        const TEMP_STATE = { response: { readData: {} } };

        expect(handleMessage(MOCK_EVENT, TEMP_STATE)).toMatchSnapshot();
    });

    test('Get Container Filesystem', () => {
        const MOCK_EVENT = makeEvent(MessageTypes.CONTAINER_TREE, { result: ['node.js'] });

        const TEMP_STATE = { response: { metaData: {} } };

        expect(handleMessage(MOCK_EVENT, TEMP_STATE)).toMatchSnapshot();
    });
});
