/**
 * 주어진 이미지에서 초록색 배경을 제거하고 투명하게 만드는 함수
 * @param src 처리할 이미지 URL
 * @returns 배경 제거된 이미지의 data URL
 */
export const chromaKeyRemove = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const target = { r: 0, g: 255, b: 0 };
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const diff = Math.abs(r - target.r) + Math.abs(g - target.g) + Math.abs(b - target.b);
        if (diff < 120) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
};
