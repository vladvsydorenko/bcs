import { MessagePortProxy, MessagePortProxyListenerFn } from "@vladnets/util-worker-message";

const channel0 = new MessageChannel();
const channel1 = new MessageChannel();

const ports0 = [channel0.port1, channel1.port1];
const ports1 = [channel0.port2, channel1.port2];

const proxy0 = new MessagePortProxy<number>(ports0, [0, 1]);
const proxy1 = new MessagePortProxy<number>(ports1, [0, 1]);

const listener: MessagePortProxyListenerFn<number, "message"> = (event, context, port) => {
    console.log(event.data, context, port);
};

proxy0.addEventListener("message", listener);
proxy1.addEventListener("message", listener);

proxy0.postMessageToAll("hello!");
proxy1.postMessageToAll("Hello!");

