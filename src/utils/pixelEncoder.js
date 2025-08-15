const canvas = new OffscreenCanvas(1, 1);
const context = canvas.getContext('2d');

export default function generateImage(message, cellSize = 1) {
    const colorComponents = [];
    Array.from(message)
        .forEach(c => {
            const code = c.charCodeAt(0);
            // If number is 16bit long, decompose it in two 8bit numbers
            if (code > 255) {
                // Most Significant Byte (the "high byte" or the first 8 bits)
                const msb = code >> 8;
                // The Least Significant Byte (the "low byte" or the last 8 bits)
                const lsb = code & 255;
                colorComponents.push(msb, lsb);
            // 8bit number
            } else {
                colorComponents.push(code);
            }
        });

    const cellsPerSide = Math.ceil( Math.sqrt(colorComponents.length / 3) );
    const size = cellsPerSide * cellSize;
    canvas.width = size;
    canvas.height = size;

    const imageData = context.createImageData(1, 1); // Create a 1x1 pixel
    imageData.data[3] = 256; // Set alpha channel
    let charIndex = 0;
    for (let i = 0; i < cellsPerSide; i++) {
        for (let j = 0; j < cellsPerSide; j++) {
            const r = colorComponents[charIndex++] || 0; // Red channel
            const g = colorComponents[charIndex++] || 0; // Green channel
            const b = colorComponents[charIndex++] || 0; // Blue channel
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
