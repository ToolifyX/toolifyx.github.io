export interface ProcessingOptions {
  maxResolution: number;
  quality: number;
  format?: string;
}

export interface ProcessedResult {
  blob: Blob;
  url: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export async function processImage(
  file: File,
  options: ProcessingOptions
): Promise<ProcessedResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale proportionally if exceeds maxResolution
        if (width > options.maxResolution || height > options.maxResolution) {
          if (width > height) {
            height = Math.round((height * options.maxResolution) / width);
            width = options.maxResolution;
          } else {
            width = Math.round((width * options.maxResolution) / height);
            height = options.maxResolution;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const format = options.format || "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }

            const url = URL.createObjectURL(blob);
            resolve({
              blob,
              url,
              name: file.name.replace(/\.[^/.]+$/, "") + (format === "image/jpeg" ? ".jpg" : ".png"),
              originalSize: file.size,
              compressedSize: blob.size,
              width,
              height,
            });

            // Cleanup
            canvas.width = 0;
            canvas.height = 0;
          },
          format,
          options.quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function processQueue(
  files: File[],
  options: ProcessingOptions,
  onProgress?: (current: number, total: number) => void
): Promise<ProcessedResult[]> {
  const results: ProcessedResult[] = [];
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(i + 1, files.length);
    const result = await processImage(files[i], options);
    results.push(result);
  }
  return results;
}
