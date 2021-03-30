import { IWorkerContext } from "./IWorkerContext";


export interface IDataConnectionMessage {
    type: "data_connection_message";
    context: IWorkerContext;
}
