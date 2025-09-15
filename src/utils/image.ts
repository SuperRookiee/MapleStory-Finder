export const cropCharacter = (src: string): Promise<HTMLCanvasElement> => {
    new Promise(res => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            const c = document.createElement("canvas");
            const ctx = c.getContext("2d")!;
            c.width = img.width;
            c.height = img.height;
            ctx.drawImage(img, 0, 0);

            const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
            let [minX, minY, maxX, maxY] = [width, height, 0, 0];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (data[(y * width + x) * 4 + 3]) {
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            const w = maxX - minX + 1;
            const h = maxY - minY + 1;
            const out = document.createElement("canvas");
            out.width = w;
            out.height = h;
            out.getContext("2d")!.drawImage(c, minX, minY, w, h, 0, 0, w, h);
            res(out.toDataURL("image/png"));
        };
    });
}