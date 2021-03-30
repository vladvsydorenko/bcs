import { DataSocket } from "./DataSocket";
import { IDataConnectionMessage } from "./IDataConnectionMessage";
import { IWorkerContext } from "./IWorkerContext";

export abstract class WorkerTools {
    /**
     * Creates message channels and cross link all workers between each other
     * @param workers Worker id array
     * @returns Worker context array with the same order and length as `workers` param
     */
    public static createWorkerContextes(workers: number[]): IWorkerContext[] {
        const contextes: IWorkerContext[] = [];
        const len = workers.length;
        for(let i = 0; i < len; i++) {
            const worker1 = workers[i];
            const worker1Context: IWorkerContext = contextes[i] || (contextes[i] = {
                id: worker1,
                ports: {},
                workers: [...workers.slice(0, i), ...workers.slice(i + 1)],
            });

            // go back to connect current element with all previous
            for(let x = i - 1; x >= 0; x--) {
                const worker2 = workers[x];
                const worker2Context: IWorkerContext = contextes[x];

                const channel = new MessageChannel();

                // one port for worker1 to connect worker2
                worker1Context.ports[worker2] = channel.port2;
                // one port for worker2 to connect worker1
                worker2Context.ports[worker1] = channel.port1;
            }
        }

        return contextes;
    }
}

function startHost() {
    const workers: number[] = [0 /* host worker */];
    const instances: { [worker: number]: Worker } = {};

    // start from 1, as 0 is host process and has no Worker instance
    for(let i = 1; i < 2; i++) {
        workers.push(i);
        instances[i] = (new Worker("build/bcs.js"));
    }

    const contextes = WorkerTools.createWorkerContextes(workers);

    for(let i = 1; i < workers.length; i++) {
        const workerInstance = instances[i];
        const message: IDataConnectionMessage = { type: "data_connection_message", context: contextes[i] };
        const transfer = Object
            .keys(message.context.ports)
            .map(key => {
                return message.context.ports[key as any];
            });
        workerInstance.postMessage(message, transfer);
    }

    const context = contextes[0];
    const socket = new DataSocket(context);

    socket.addEventListener("message", (ev: MessageEvent, sender: number) => {
        console.log(`worker_${sender} sent message to worker_${context.id}`, ev.data);
    });

    setTimeout(() => {
        for(let i = 1; i < workers.length; i++) {
            socket.send(workers[i], { message: "Hello" });
        }
    }, 2000);
}

function startWorker() {
    addEventListener("message", (ev: MessageEvent<IDataConnectionMessage>) => {
        const message = ev.data;
        if (message.type === "data_connection_message") {
            const context = message.context;
            const socket = new DataSocket(context);
            socket.addEventListener("message", (ev: MessageEvent, sender: number) => {
                console.log(`worker_${sender} sent message to worker_${context.id}`, ev.data);
            });

        }
    });
}

if (typeof window === "object") {
    startHost();
}
else {
    startWorker();
}
