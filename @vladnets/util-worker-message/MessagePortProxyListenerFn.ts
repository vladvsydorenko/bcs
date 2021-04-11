export type MessagePortProxyListenerFn<T, K extends keyof MessagePortEventMap> = (
    ev: MessagePortEventMap[K],
    context: T,
    port: MessagePort
) => any;
