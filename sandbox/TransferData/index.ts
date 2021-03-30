// // export interface ITransfarable {}
// interface ITransferData<T = any> {
//     toTransfer(): ITransfer<T>;
//     fromTramsfer(transfer: ITransfer<T>): T;
// }

// export interface ITransferSocket {
//     id: number;

//     // null if not in host process
//     worker: Worker | null;

//     // ids of other sockets
//     connections: number[];

//     // map socket ids from `connections` field to MessagePort
//     ports: {
//         [connection: number]: MessagePort;
//     };
// }

// export interface ITransfer<T = any> {
//     kind: number;
//     body: T;
//     shared: ArrayBuffer[];
// }

// export class TransferManager {
//     public onmessage: ((event: MessageEvent<ITransfer>) => void) | undefined;

//     public constructor(
//         public readonly socket: ITransferSocket,
//     ) {}

//     public connect() {
//         const ports = this.socket.ports;
//         const connections = this.socket.connections;
//         const len = connections.length;

//         for(let i = 0; i < len; i++) {
//             const port = ports[connections[i]];
//             port.onmessage = (event: MessageEvent<ITransfer>) => {
//                 const handler = this.onmessage;
//                 if (handler) {
//                     handler(event);
//                 }
//             };
//         }
//     }

//     public send(transfer: ITransfer) {
//         // const port = this.socket.ports[transfer.target];
//         // port.postMessage(transfer, transfer.shared);
//     }
// }

// class TransferDataConnection {
//     public readonly manager: TransferManager;

//     public constructor(
//         socket: ITransferSocket,
//     ) {
//         this.manager = new TransferManager(socket);
//     }

//     private connect() {
//         this.manager.onmessage = this.onTransferMessage;
//     }

//     private onTransferMessage(event: MessageEvent<ITransfer>) {
//         const transfer = event.data;
//     }
// }

// interface IConnectHandlers {
//     onTransfer: (transfer: ITransfer) => void;
//     onError?: (ev: MessageEvent) => void;
// }
// enum EMessageKind {
//     WorkerConnection
// }
// interface IWorkerConnectionMessage {
//     kind: EMessageKind;
//     socket: ITransferSocket;
// }
// abstract class TransferTools {
//     public static register

//     public static connectWorker() {
//         const onmessage = (ev: MessageEvent<IWorkerConnectionMessage>) => {
//             const connection = ev.data;
//             const kind = connection.kind;

//             switch (kind) {
//                 case EMessageKind.WorkerConnection:
//                     const socket = connection.socket;
//                     break;

//                 default:
//                     break;
//             }
//         };
//         addEventListener("message", onmessage);
//     }

//     public static connect(socket: ITransferSocket, handlers: IConnectHandlers) {
//         const { ports, connections } = socket;
//         const { onTransfer, onError } = handlers;
//         const len = connections.length;
//         for(let i = 0; i < len; i++) {
//             const port = ports[connections[i]];

//             port.onmessage = (ev) => onTransfer(ev.data);

//             if (onError) {
//                 port.onmessageerror = (ev: MessageEvent) => onError(ev.data);
//             }
//         }
//     }

//     public static send(target: number, socket: ITransferSocket, transfer: ITransfer) {
//         const port = socket.ports[target];
//         port.postMessage(transfer, transfer.shared);
//     }
// }