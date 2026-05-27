/**
 * Reusable image conversion helper using Canvas API
 */
export interface ConversionResult {
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

export const convertImage = (
  file: File,
  targetFormat: string,
  quality: number = 0.9
): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }

            // Determine extension
            let extension = targetFormat.split("/")[1];
            if (extension === "jpeg") extension = "jpg";

            const fileName = file.name.replace(/\.[^/.]+$/, "") + `.${extension}`;

            resolve({
              blob,
              name: fileName,
              width: img.width,
              height: img.height
            });

            // Cleanup
            URL.revokeObjectURL(img.src);
          },
          targetFormat,
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export interface CropDimensions {
  x: number; // Percent 0-100
  y: number; // Percent 0-100
  width: number; // Percent 0-100
  height: number; // Percent 0-100
}

export const cropImage = (
  file: File,
  crop: CropDimensions,
  targetFormat: string = 'image/png'
): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");

      // Calculate pixel coordinates
      let pxX = (crop.x / 100) * img.naturalWidth;
      let pxY = (crop.y / 100) * img.naturalHeight;
      let pxWidth = (crop.width / 100) * img.naturalWidth;
      let pxHeight = (crop.height / 100) * img.naturalHeight;

      // Downscale if too large (> 2500px)
      const MAX_DIM = 2500;
      if (pxWidth > MAX_DIM || pxHeight > MAX_DIM) {
        const scale = Math.min(MAX_DIM / pxWidth, MAX_DIM / pxHeight);
        pxWidth *= scale;
        pxHeight *= scale;
      }

      canvas.width = pxWidth;
      canvas.height = pxHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw the cropped portion
      ctx.drawImage(
        img,
        pxX, pxY, pxWidth, pxHeight, // source
        0, 0, pxWidth, pxHeight       // destination
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob failed"));
            return;
          }

          let extension = targetFormat.split("/")[1] || 'png';
          if (extension === "jpeg") extension = "jpg";
          const fileName = `cropped-${file.name.replace(/\.[^/.]+$/, "")}.${extension}`;

          resolve({
            blob,
            name: fileName,
            width: pxWidth,
            height: pxHeight
          });

          URL.revokeObjectURL(img.src);
        },
        targetFormat,
        0.9
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};
