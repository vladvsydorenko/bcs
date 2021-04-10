import { MessagePortSocket, PortProxyListenerFn } from "./MessagePortSocket";


const channel = new MessageChannel();
const socket0 = new MessagePortSocket(channel.port1, 0);
const socket1 = new MessagePortSocket(channel.port2, 1);

const listener: PortProxyListenerFn<number, "message"> = (event, context, port) => {
    console.log(event.data, context, port);
};
socket0.addEventListener("message", listener);
socket1.addEventListener("message", listener);

socket0.port.start();
socket1.port.start();

socket1.port.postMessage("test");
socket0.port.postMessage("test");
