import { PNG } from "pngjs";

/**
 * Remove transparent borders from a PNG image buffer.
 */
export function trimImage(buffer: Buffer): Uint8Array {
    const png = PNG.sync.read(buffer);
    const { width, height, data } = png;

    let left = width;
    let right = -1;
    let top = height;
    let bottom = -1;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (width * y + x) << 2;
            // Check alpha channel
            if (data[idx + 3] !== 0) {
                if (x < left) left = x;
                if (x > right) right = x;
                if (y < top) top = y;
                if (y > bottom) bottom = y;
            }
        }
    }

    // If no opaque pixel found, return original buffer
    if (right === -1 || bottom === -1) return buffer;

    const cropWidth = right - left + 1;
    const cropHeight = bottom - top + 1;
    const cropped = new PNG({ width: cropWidth, height: cropHeight });

    for (let y = 0; y < cropHeight; y++) {
        const srcStart = ((y + top) * width + left) << 2;
        const srcEnd = srcStart + (cropWidth << 2);
        const destStart = (y * cropWidth) << 2;
        data.copy(cropped.data, destStart, srcStart, srcEnd);
    }

    // pngjs returns a Node Buffer which extends Uint8Array
    return PNG.sync.write(cropped);
}
