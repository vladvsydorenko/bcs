import { MessagePortProxyListenerFn } from "./MessagePortProxyListenerFn";
import { MessagePortSocket } from "./MessagePortSocket";
import { WorkerMessageTools } from "./WorkerMessageTools";

class MessagePortProxy2<T> {
    public readonly sockets: MessagePortSocket<T>[] = [];
    private _listenersReg: {
        [type: string]: MessagePortProxyListenerFn<T, any>[];
    } = {};


    public addPort(port: MessagePort, context: T) {
        const socket = new MessagePortSocket<T>(port, context);
        socket.addEventListener("message", this.onMessage.bind(this));
    }

    public removePort(port: MessagePort) {

    }

    public addEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: MessagePortProxyListenerFn<T, K>,
        options?: boolean | AddEventListenerOptions
    ): void {
    }

    private onMessage(ev: MessageEvent, context: T, port: MessagePort) {
        this._listenersReg["message"].forEach(listener => {
            listener(ev, context, port);
        });
    }
}

export class MessagePortProxy<T> {
    public readonly sockets: MessagePortSocket<T>[];

    public constructor(
        ports: MessagePort[],
        contexts: T[]
    ) {
        const len = Math.min(ports.length, contexts.length);

        if (ports.length !== contexts.length) {
            let warning = `${MessagePortProxy.name} ports and contexts should be of the same order and length;\n`;
            warning += `Received: ports: ${ports.length}; contexts: ${contexts.length}`;
            console.log(warning);
        }

        const sockets: MessagePortSocket<T>[] = [];
        for (let i = 0; i < len; i++) {
            const port = ports[i];
            const context = contexts[i];

            const socket = new MessagePortSocket(port, context);
            sockets.push(socket);

            port.postMessage
        }

        this.sockets = sockets;
    }

    public addPort(id: number, port: MessagePort) {

    }

    public addEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: MessagePortProxyListenerFn<T, K>,
        options?: boolean | AddEventListenerOptions
    ): void {
        const { sockets: _sockets } = this;
        const len = _sockets.length;

        for (let i = 0; i < len; i++) {
            const socket = _sockets[i];
            socket.addEventListener(type, listener, options);
        }
    }

    public removeEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: MessagePortProxyListenerFn<T, K>,
        options?: boolean | EventListenerOptions
    ): void {
        const { sockets: _sockets } = this;
        const len = _sockets.length;

        for (let i = 0; i < len; i++) {
            const socket = _sockets[i];
            socket.removeEventListener(type, listener, options);
        }
    }

    public postMessageToAll(message: any) {
        WorkerMessageTools.postMessageToSockets(this.sockets, message);
    }
}
