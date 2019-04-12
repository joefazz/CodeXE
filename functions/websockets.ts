import { MessageTypes } from '../@types';

export function handleMessage(event: MessageEvent, currentState: any) {
    const { type, data }: { type: MessageTypes; data: any } = JSON.parse(event.data);
    console.log('Message Recieved!', 'Type: ' + type, 'Data: ' + JSON.stringify(data));

    switch (type) {
        case MessageTypes.CONTAINER_START:
            console.log('Container Started');
            if (currentState.containerName === '' && currentState.id === '') {
                const { name, info } = data;
                return {
                    containerName: name,
                    status: 'connected',
                    id: info.Config.Hostname
                };
            } else {
                return { status: 'connected' };
            }
            break;
        case MessageTypes.CONTAINER_PAUSE:
            return { status: 'idle' };
            break;
        case MessageTypes.CONTAINER_RESUME:
            return { status: 'connected' };
            break;
        case MessageTypes.CONTAINER_EXEC:
            console.log('Execution returned');
            return {
                response: { ...currentState.response, writeData: { output: data } }
            };
            break;
        case MessageTypes.CONTAINER_READ:
            console.log('Code read');
            return {
                response: { ...currentState.response, readData: data }
            };
            break;
        case MessageTypes.CONTAINER_STOP:
            console.log('stopped container');
            break;
        case MessageTypes.EXERCISE_CONNECT:
            return {
                activityId: data
            };
            break;
        case MessageTypes.EXERCISE_STOP:
            return {
                activityId: ''
            };
            break;
        case MessageTypes.CODE_SAVE:
            console.log('Code save returned');
            return {
                response: {
                    ...currentState.response,
                    metaData: {
                        ...currentState.response.metaData,
                        saveInfo: { timestamp: Date.now(), succeed: data.success }
                    }
                }
            };
            break;
        case MessageTypes.CODE_READ:
            console.log('Code read returned');
            return {
                response: {
                    ...currentState.response,
                    readData: { ...currentState.response.readData, code: data.code }
                }
            };
            break;
        case MessageTypes.CONTAINER_TREE:
            console.log('Container tree returned');
            return {
                response: {
                    ...currentState.response,
                    metaData: {
                        ...currentState.response.metaData,
                        tree: data.result
                    }
                }
            };
            break;
        default:
            console.log('other type', data);
    }
}
