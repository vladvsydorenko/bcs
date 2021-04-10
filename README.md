# WorkerHub

First of all, process should be able to transfer ArrayBuffer to another process.
Each process is subscribing for buffer updates.

Processes always communicate by buffers.
[commandBuffer, ...restBuffers]

commandBuffer is buffer containing type of message and other meta information.
restBuffers are buffers with actual data.

// host
```ts
const worker = new Worker("uri");
const workerController = new WorkerController(worker);
```
