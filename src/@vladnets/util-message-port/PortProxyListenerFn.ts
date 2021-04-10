export type PortProxyListenerFn<T, K extends keyof MessagePortEventMap> = (
    this: MessagePort,
    ev: MessagePortEventMap[K],
    context: T,
    port: MessagePort
) => any;
