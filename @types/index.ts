import { SetStateAction } from 'react';

import * as Response from './response';
import * as Data from './Data';

export { Data, Response };

export type Context = {
    id: string; // Container ID
    status: 'connected' | 'idle' | 'disconnected';
    socket: WebSocket;
    activityId: string;
    response: ContextResponse;
    containerName: string;
};

export type ContextResponse = {
    readData: any;
    writeData: any;
    metaData: any;
};

export enum Languages {
    JS = 'javascript',
    PYTHON = 'python',
    C = 'cpp'
}

export type ReactSetter<Type> = React.Dispatch<SetStateAction<Type>>;

export enum MessageTypes {
    CONTAINER_START = 'Container.Start',
    CONTAINER_EXEC = 'Container.Exec',
    CONTAINER_READ = 'Container.Read',
    CONTAINER_STOP = 'Container.Stop',
    CONTAINER_PAUSE = 'Container.Pause',
    CONTAINER_RESUME = 'Container.Resume',
    CONTAINER_TREE = 'Container.TreeRead',
    EXERCISE_START = 'Exercise.Start',
    EXERCISE_CONNECT = 'Exercise.Connect',
    EXERCISE_STOP = 'Exercise.Stop',
    EXERCISE_RUN = 'Exercise.Run',
    EXERCISE_EXEC = 'Exercise.Exec',
    CODE_SAVE = 'Code.Save',
    CODE_READ = 'Code.Read'
}
