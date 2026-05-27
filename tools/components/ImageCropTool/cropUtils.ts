export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = (
  image: HTMLImageElement,
  crop: CropArea,
  fileName: string,
  flip: { horizontal: boolean; vertical: boolean } = { horizontal: false, vertical: false },
  format: string = 'image/jpeg',
  quality: number = 0.9
): Promise<{ blob: Blob; url: string }> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Canvas context not available'));
  }

  ctx.save();

  // Handle flipping
  if (flip.horizontal || flip.vertical) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob)
        });
      },
      format,
      quality
    );
  });
};
