export type Context = {
    id: string; // Container ID
    status: 'connected' | 'idle' | 'disconnected';
    socket: WebSocket;
    exerciseId: string;
    response: {
        readData: any;
        writeData: any;
        metaData: any;
    };
    containerName: string;
};

export enum Languages {
    JS = 'javascript',
    PYTHON = 'python',
    C = 'cpp'
}

export enum MessageTypes {
    CONTAINER_START = 'Container.Start',
    CONTAINER_EXEC = 'Container.Exec',
    CONTAINER_READ = 'Container.Read',
    CONTAINER_STOP = 'Container.Stop',
    CONTAINER_PAUSED = 'Container.Paused',
    EXERCISE_START = 'Exercise.Start',
    EXERCISE_CONNECT = 'Exercise.Connect',
    EXERCISE_STOP = 'Exercise.Stop',
    EXERCISE_RUN = 'Exercise.Run',
    EXERCISE_EXEC = 'Exercise.Exec',
    CODE_SAVE = 'Code.Save'
}
