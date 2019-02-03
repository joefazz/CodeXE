export type Context = {
    containerID: string;
    status: 'connected' | 'disconneted';
    socket: WebSocket;
    response: {
        readableData: string;
        meta_data: any;
    };
    containerName: string;
};
