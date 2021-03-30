export interface IWorkerContext {
    // current worker id
    id: number;
    // connected workers
    workers: number[];
    ports: { [worker: number]: MessagePort; };
}
