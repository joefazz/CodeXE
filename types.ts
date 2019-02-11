export type Context = {
    id: string; // Container ID
    status: 'connected' | 'disconnected';
    socket: WebSocket;
    response: {
        readableData: string;
        writeData: string;
        meta_data: any;
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
    EXERCISE_START = 'Exercise.Start'
}
