import { IWorkerContext } from "./IWorkerContext";

// message port listener that calls TDataListener
type TMessagePortListener<K extends keyof MessagePortEventMap> = (this: MessagePort, ev: MessagePortEventMap[K]) => any;

// actual listener for DataSocket
export type TDataSocketListener<K extends keyof MessagePortEventMap> = (this: MessagePort, ev: MessagePortEventMap[K], worker: number) => any;

export class DataSocket {
    public readonly context: IWorkerContext;

    // map user listener to system handler
    private handlerMap: WeakMap<TDataSocketListener<any>, TMessagePortListener<any>> = new WeakMap();

    public constructor(context: IWorkerContext) {
        this.context = context;
    }

    public send(worker: number, data: any, transfer?: Transferable[]) {
        const { ports } = this.context;
        const port = ports[worker];

        if (port === undefined) {
            console.error(`${DataSocket.name}: Port for worker_${worker} is not found`);
            return;
        }

        port.postMessage(data, transfer || []);
    }

    // similar API as MessagePort.addEventListener
    public addEventListener<K extends keyof MessagePortEventMap>(type: K, listener: TDataSocketListener<K>, options?: boolean | AddEventListenerOptions): void {
        const { ports, workers: workers } = this.context;
        const len = workers.length;

        for (let i = 0; i < len; i++) {
            const worker = workers[i];
            const port = ports[worker];
            const handler = (event: MessagePortEventMap[K]) => {
                // use call to bind this MessagePort as original onmessage handler
                listener.call(port, event, worker);
            };
            // map handler to user listener for removing event listener
            this.handlerMap.set(listener, handler);
            port.addEventListener(type, handler, options);
        }
    }

    // similar API as MessagePort.removeEventListener
    public removeEventListener<K extends keyof MessagePortEventMap>(type: K, listener: TDataSocketListener<K>, options?: boolean | EventListenerOptions): void {
        const { ports, workers: workers } = this.context;
        const len = workers.length;

        for (let i = 0; i < len; i++) {
            const worker = workers[i];
            const port = ports[worker];

            // get actual bound callback from map
            const handler = this.handlerMap.get(listener);

            if (typeof handler === "undefined") {
                return;
            }

            port.removeEventListener(type, handler, options);
        }
    }
}
