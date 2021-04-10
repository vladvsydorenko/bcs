export type PortListenerFn<K extends keyof MessagePortEventMap> = (this: MessagePort, ev: MessagePortEventMap[K]) => any;
export type PortProxyListenerFn<T, K extends keyof MessagePortEventMap> = (
    this: MessagePort,
    ev: MessagePortEventMap[K],
    context: T,
    port: MessagePort,
) => any;

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
