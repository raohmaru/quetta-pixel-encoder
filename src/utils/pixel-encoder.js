const offsetCanvas = new OffscreenCanvas(1, 1);

// Set up a worker thread to render on the OffscreenCanvas
const worker = new Worker(new URL('./canvas-worker.js', import.meta.url));
worker.postMessage({ canvas: offsetCanvas }, [offsetCanvas]);

export default function generateImage(message, cellSize = 1) {
    worker.postMessage({ cmd: 'encode', payload: {message, cellSize} });
    return new Promise(((resolve, reject) => {
        worker.onmessage = (e) => {
            resolve(e.data);
        };
        setTimeout(() => reject(), 10_000);
    }));
}
