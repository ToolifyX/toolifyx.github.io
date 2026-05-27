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
  const processingRef = useRef<Set<string>>(new Set());
  const allGeneratedUrls = useRef<Set<string>>(new Set());

  // Initialize or update images when initialImages changes
  useEffect(() => {
    setImages(prev => {
      const newImages = initialImages.map(info => {
        const existing = prev.find(p => p.id === info.id);
        if (existing) {
          // Update original dimensions if they were previously 0
          if (existing.originalWidth === 0 && info.originalWidth !== 0) {
            return {
              ...existing,
              originalWidth: info.originalWidth,
              originalHeight: info.originalHeight,
              // If we didn't have dimensions before, we might need to re-calc resized dimensions
              // though the effect below will trigger a processSingleImage which updates them.
            };
          }
          return existing;
        }
        return {
          ...info,
          resizedUrl: info.originalUrl,
          resizedWidth: info.originalWidth,
          resizedHeight: info.originalHeight,
          resizedBlob: null,
          isProcessing: false
        };
      });

      // Cleanup removed images from imageElements cache
      const initialIds = new Set(initialImages.map(i => i.id));
      Array.from(imageElements.current.keys()).forEach(id => {
        if (!initialIds.has(id)) {
          imageElements.current.delete(id);
        }
      });

      return newImages;
    });
  }, [initialImages]);

  const processSingleImage = useCallback(async (imgInfo: ResizedImage, currentSettings: ResizeSettings) => {
    if (processingRef.current.has(imgInfo.id)) return;
    processingRef.current.add(imgInfo.id);

    setImages(prev => prev.map(img => img.id === imgInfo.id ? { ...img, isProcessing: true } : img));

    try {
      let imgElement = imageElements.current.get(imgInfo.id);
      if (!imgElement) {
        imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imgInfo.originalUrl;
        });
        imageElements.current.set(imgInfo.id, imgElement);
      }

      const result = await resizeImage(imgElement, currentSettings);
      allGeneratedUrls.current.add(result.url);

      setImages(prev => prev.map(img => {
        if (img.id === imgInfo.id) {
          if (img.resizedUrl !== img.originalUrl) {
            URL.revokeObjectURL(img.resizedUrl);
            allGeneratedUrls.current.delete(img.resizedUrl);
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
      console.error(`Error processing image ${imgInfo.id}:`, error);
      setImages(prev => prev.map(img => img.id === imgInfo.id ? { ...img, isProcessing: false } : img));
    } finally {
      processingRef.current.delete(imgInfo.id);
    }
  }, []);

  // Re-process all images when settings change or new images are added
  useEffect(() => {
    if (images.length === 0) return;

    const timeoutId = setTimeout(() => {
      images.forEach(img => {
        processSingleImage(img, settings);
      });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [settings, images.length, images.some(img => img.resizedWidth === 0 && img.originalWidth > 0), processSingleImage]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      allGeneratedUrls.current.forEach(url => URL.revokeObjectURL(url));
      allGeneratedUrls.current.clear();
    };
  }, []);

  return {
    images,
    setImages
  };
}
