export interface ResizeSettings {
  mode: 'percentage' | 'dimensions';
  percentage: number;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  noEnlarge: boolean;
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
}

export interface ImageInfo {
  id: string;
  file: File;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
}

export const calculateNewDimensions = (
  originalWidth: number,
  originalHeight: number,
  settings: ResizeSettings
) => {
  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (settings.mode === 'percentage') {
    const scale = settings.percentage / 100;
    newWidth = Math.round(originalWidth * scale);
    newHeight = Math.round(originalHeight * scale);
  } else {
    newWidth = settings.width;
    newHeight = settings.height;

    if (settings.maintainAspectRatio) {
      const ratio = originalWidth / originalHeight;
      if (newWidth / newHeight > ratio) {
        newWidth = Math.round(newHeight * ratio);
      } else {
        newHeight = Math.round(newWidth / ratio);
      }
    }
  }

  if (settings.mode === 'dimensions' && settings.noEnlarge) {
    if (newWidth > originalWidth) {
      const ratio = originalWidth / newWidth;
      newWidth = originalWidth;
      newHeight = Math.round(newHeight * ratio);
    }
    if (newHeight > originalHeight) {
      const ratio = originalHeight / newHeight;
      newHeight = originalHeight;
      newWidth = Math.round(newWidth * ratio);
    }
  }

  return { width: Math.max(1, newWidth), height: Math.max(1, newHeight) };
};

export const resizeImage = async (
  img: HTMLImageElement,
  settings: ResizeSettings
): Promise<{ blob: Blob; url: string; width: number; height: number }> => {
  const { width, height } = calculateNewDimensions(img.naturalWidth, img.naturalHeight, settings);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'));
          return;
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width,
          height,
        });
      },
      `image/${settings.format}`,
      settings.format === 'png' ? undefined : settings.quality / 100
    );
  });
};
