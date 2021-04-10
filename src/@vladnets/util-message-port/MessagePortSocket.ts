import { PortListenerFn } from "./PortListenerFn";
import { PortProxyListenerFn } from "./PortProxyListenerFn";

export class MessagePortSocket<T> {
    public readonly port: MessagePort;
    public readonly context: T;

    private _listenerMap: WeakMap<PortProxyListenerFn<T, any>, PortListenerFn<any>> = new WeakMap();

    public constructor(
        port: MessagePort,
        context: T
    ) {
        this.port = port;
        this.context = context;
    }

    public addEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: PortProxyListenerFn<T, K>,
        options?: boolean | AddEventListenerOptions
    ): void {
        const portListener = (event: MessageEvent) => {
            listener.call(this.port, event, this.context, this.port);
        };

        this._listenerMap.set(listener, portListener);

        this.port.addEventListener(type, portListener, options);
    }

    public removeEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: PortProxyListenerFn<T, K>,
        options?: boolean | EventListenerOptions
    ): void {
        const portListener = this._listenerMap.get(listener);

        if (!portListener) {
            return;
        }

        this.port.removeEventListener(type, portListener, options);
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
        for(let i = 0; i < len; i++) {
            const port = ports[i];
            const context = contexts[i];

            const socket = new MessagePortSocket(port, context);
            sockets.push(socket);
        }

        this.sockets = sockets;
    }

    public addEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: PortProxyListenerFn<T, K>,
        options?: boolean | AddEventListenerOptions
    ): void {
        const { sockets: _sockets } = this;
        const len = _sockets.length;

        for(let i = 0; i < len; i++) {
            const socket = _sockets[i];
            socket.addEventListener(type, listener, options);
        }
    }

    public removeEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: PortProxyListenerFn<T, K>,
        options?: boolean | EventListenerOptions
    ): void {
        const { sockets: _sockets } = this;
        const len = _sockets.length;

        for(let i = 0; i < len; i++) {
            const socket = _sockets[i];
            socket.removeEventListener(type, listener, options);
        }
    }
}
