import { useState, useCallback, useEffect, useRef } from 'react';
import { ResizeSettings, ImageInfo, resizeImage } from './resizeUtils';

export interface ResizedImage extends ImageInfo {
  resizedUrl: string;
  resizedWidth: number;
  resizedHeight: number;
  resizedBlob: Blob | null;
  isProcessing: boolean;
}

export function useBatchResizeEngine(initialImages: ImageInfo[], settings: ResizeSettings) {
  const [images, setImages] = useState<ResizedImage[]>([]);
  const imageElements = useRef<Map<string, HTMLImageElement>>(new Map());

  // Initialize or update images when initialImages changes
  useEffect(() => {
    setImages(prev => {
      const newImages = initialImages.map(info => {
        const existing = prev.find(p => p.id === info.id);
        if (existing) return existing;
        return {
          ...info,
          resizedUrl: info.originalUrl,
          resizedWidth: info.originalWidth,
          resizedHeight: info.originalHeight,
          resizedBlob: null,
          isProcessing: false
        };
      });
      return newImages;
    });
  }, [initialImages]);

  const processImage = useCallback(async (id: string, currentSettings: ResizeSettings) => {
    const imgInfo = images.find(img => img.id === id);
    if (!imgInfo) return;

    setImages(prev => prev.map(img => img.id === id ? { ...img, isProcessing: true } : img));

    try {
      let imgElement = imageElements.current.get(id);
      if (!imgElement) {
        imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imgInfo.originalUrl;
        });
        imageElements.current.set(id, imgElement);
      }

      const result = await resizeImage(imgElement, currentSettings);

      setImages(prev => prev.map(img => {
        if (img.id === id) {
          // Revoke old URL if it's not the original one
          if (img.resizedUrl !== img.originalUrl) {
            URL.revokeObjectURL(img.resizedUrl);
          }
          return {
            ...img,
            resizedUrl: result.url,
            resizedWidth: result.width,
            resizedHeight: result.height,
            resizedBlob: result.blob,
            isProcessing: false
          };
        }
        return img;
      }));
    } catch (error) {
      console.error(`Error processing image ${id}:`, error);
      setImages(prev => prev.map(img => img.id === id ? { ...img, isProcessing: false } : img));
    }
  }, [images]);

  // Re-process all images when settings change
  useEffect(() => {
    if (images.length === 0) return;

    const timeoutId = setTimeout(() => {
      images.forEach(img => {
        processImage(img.id, settings);
      });
    }, 400); // Debounce resizing

    return () => clearTimeout(timeoutId);
  }, [settings, images.length, processImage]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.resizedUrl !== img.originalUrl) {
          URL.revokeObjectURL(img.resizedUrl);
        }
      });
    };
  }, [images]);

  return {
    images,
    setImages
  };
}
