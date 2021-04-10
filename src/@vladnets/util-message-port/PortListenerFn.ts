export type PortListenerFn<K extends keyof MessagePortEventMap> = (this: MessagePort, ev: MessagePortEventMap[K]) => any;
