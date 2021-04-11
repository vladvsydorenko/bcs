export type MessagePortListenerFn<K extends keyof MessagePortEventMap> = (this: MessagePort, ev: MessagePortEventMap[K]) => any;
