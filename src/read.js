const img = document.getElementById('namarie');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d', { willReadFrequently: true });
const cellSize = 1;
const cellsPerSide = img.naturalWidth / cellSize;

// Set canvas size to match the image
canvas.width = img.naturalWidth;
canvas.height = img.naturalHeight;

// Draw the image onto the canvas
context.drawImage(img, 0, 0);

let decoded = '';
// Walk over the rows and columns of the image
for (let i = 0; i < cellsPerSide; i++) {
    for (let j = 0; j < cellsPerSide; j++) {
        // Get the pixel data for the current cell
        const imageData = context.getImageData(i * cellSize, j * cellSize, Math.ceil(cellSize / 2), Math.ceil(cellSize / 2));
        const [r, g, b , a] = imageData.data;
        // Skip black pixels
        if (r | g | b) {
            decoded += String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b);
        }
    }
}
document.querySelector('output').textContent = decoded;