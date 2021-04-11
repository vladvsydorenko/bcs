// Transfarable worker context
// server transfers it to worker on start,
// worker transfers it back on end
interface IWorkerContext {
    // id of current worker
    id: number;
    // set of ids of all connected workers except current one
    workers: number[];
    // registry to get port by worker id
    // e.g. const port = portsReg[workers[i]]
    portsReg: {
        [worker: number]: MessagePort;
    };
}

interface IConnection {
    [worker: number]: IWorkerContext;
}

/**
 * Hub Server should be run on processes that able to create workers
 * (not all browsers allow worker creating from worker process)
 * Each added worker gets its id representing it in all workers
 */
class WorkerHubServer {
    public readonly workers: Worker[] = [];

    public addWorker(worker: Worker) {
        // make ports for all existes workers
        this.workers.forEach(existedWorker => {
            const channel = new MessageChannel();
            const existedWorkerPort = channel.port1;
            const workerPort = channel.port2;
        });
    }

    private buildConnection() {

    }
}
