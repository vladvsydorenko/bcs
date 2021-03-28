export interface ITransferDataConnection {
    workers: number[];
    ports: {
        [worker: number]: MessagePort;
    };
}

// ---------------------------------------------------------------------------------//
// Test Begins
// ---------------------------------------------------------------------------------//

// shared
const connection: ITransferDataConnection = {
    workers: [0, /* 1,*/ 2],
    ports: {}
};

// ---------------------------------------------------------------------------------//
// Host

function renderTextures() {
    const textures: ArrayBuffer[] = [];

    const len = Math.min(textures.length, connection.workers.length);
    for(let i = 0; i < len; i++) {
        const port = connection.ports[connection.workers[i]];
        const texture = textures[i];
        // view to meta data
        const view = new Uint32Array(texture, 0, 1);
        // 0 element - worker id where to send buffer after processing
        view[0] = 0;

        // send texture to worker
        port.postMessage(textures[i], [textures[i]]);
    }
}

// ---------------------------------------------------------------------------------//
// Worker

function processTexture(texture: ArrayBuffer) {
    const view = new Uint32Array(texture, 0, 1);
    const owner = view[0];

    const ownerPort = connection.ports[owner];

    // sent texture back to owner
    ownerPort.postMessage(texture, [texture]);
}
