import { MessagePortListenerFn } from "./MessagePortListenerFn";
import { MessagePortProxyListenerFn } from "./MessagePortProxyListenerFn";

export class MessagePortSocket<T> {
    public readonly port: MessagePort;
    public readonly context: T;

    private _listenerReg: {
        [type: string]: Map<MessagePortProxyListenerFn<T, any>, MessagePortListenerFn<any>>;
    } = {};

    public constructor(
        port: MessagePort,
        context: T
    ) {
        this.port = port;
        this.context = context;
    }

    public addEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: MessagePortProxyListenerFn<T, K>,
        options?: boolean | AddEventListenerOptions
    ): void {
        const portListener = (event: MessageEvent) => {
            listener(event, this.context, this.port);
        };

        const map = this._listenerReg[type] = (this._listenerReg[type] || new Map());
        map.set(listener, portListener);

        this.port.addEventListener(type, portListener, options);
    }

    public removeEventListener<K extends keyof MessagePortEventMap>(
        type: K,
        listener: MessagePortProxyListenerFn<T, K>,
        options?: boolean | EventListenerOptions
    ): void {
        const listenerMap = this._listenerReg[type];

        if (!listenerMap) {
            return;
        }

        const portListener = listenerMap.get(listener);

        if (!portListener) {
            return;
        }

        this.port.removeEventListener(type, portListener, options);
    }

    // unsubscribe from all
    public removeEventListeners<K extends keyof MessagePortEventMap>(
        type: K,
        options?: boolean | EventListenerOptions
    ) {
        const listenerMap = this._listenerReg[type];

        if (!listenerMap) {
            return;
        }

        listenerMap.forEach(listener => {
            this.port.removeEventListener(type, listener, options);
        });
        listenerMap.clear();
    }
}
