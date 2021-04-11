import { MessagePortSocket } from "./MessagePortSocket";

export abstract class WorkerMessageTools {
    public static postMessageToPorts(ports: MessagePort[], message: any) {
        const len = ports.length;

        for (let i = 0; i < len; i++) {
            const port = ports[i];
            port.postMessage(message);
        }
    }

    public static postMessageToSockets<T = any>(sockets: MessagePortSocket<T>[], message: any) {
        const len = sockets.length;

        for (let i = 0; i < len; i++) {
            const socket = sockets[i];
            socket.port.postMessage(message);
        }
    }
}
