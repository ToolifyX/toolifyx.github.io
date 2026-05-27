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
