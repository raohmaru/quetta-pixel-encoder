const canvas = new OffscreenCanvas(1, 1);
const context = canvas.getContext('2d');

export default function generateImage(message, cellSize = 1) {
    const cellsPerSide = Math.ceil( Math.sqrt(message.length / 3) );
    const size = cellsPerSide * cellSize;
    canvas.width = size;
    canvas.height = size;

    const imageData = context.createImageData(1, 1); // Create a 1x1 pixel
    imageData.data[3] = 256; // Set alpha channel
    let charIndex = 0;
    for (let i = 0; i < cellsPerSide; i++) {
        for (let j = 0; j < cellsPerSide; j++) {
            const r = message.charCodeAt(charIndex++) || 0; // Red channel
            const g = message.charCodeAt(charIndex++) || 0; // Green channel
            const b = message.charCodeAt(charIndex++) || 0; // Blue channel
            // Draw 1 pixel using ImageData for better performance
            if (cellSize === 1) {
                imageData.data[0] = r;
                imageData.data[1] = g;
                imageData.data[2] = b;
                // Draw the pixel on the canvas
                context.putImageData(imageData, i * cellSize, j * cellSize);
            } else {
                context.fillStyle = `rgb(${r}, ${g}, ${b})`;
                context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }

    return canvas.transferToImageBitmap();
}
