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

  // Keep a ref to the latest images to avoid closure issues in async callbacks
  const imagesRef = useRef<ResizedImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Initialize or update images when initialImages changes
  useEffect(() => {
    setImages(prev => {
      const newImages = initialImages.map(info => {
        const existing = prev.find(p => p.id === info.id);
        if (existing) {
          if (existing.originalWidth === 0 && info.originalWidth !== 0) {
            return {
              ...existing,
              originalWidth: info.originalWidth,
              originalHeight: info.originalHeight,
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

      const initialIds = new Set(initialImages.map(i => i.id));
      Array.from(imageElements.current.keys()).forEach(id => {
        if (!initialIds.has(id)) {
          imageElements.current.delete(id);
        }
      });

      return newImages;
    });
  }, [initialImages]);

  const processSingleImage = useCallback(async (id: string, currentSettings: ResizeSettings): Promise<ResizedImage | null> => {
    const imgInfo = imagesRef.current.find(img => img.id === id);
    if (!imgInfo || processingRef.current.has(id)) return null;

    processingRef.current.add(id);
    setImages(prev => prev.map(img => img.id === id ? { ...img, isProcessing: true } : img));

    try {
      let imgElement = imageElements.current.get(id);
      if (!imgElement) {
        imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imgInfo.originalUrl;
        });
        imageElements.current.set(id, imgElement);
      }

      const result = await resizeImage(imgElement, currentSettings);
      allGeneratedUrls.current.add(result.url);

      const updatedImg: ResizedImage = {
        ...imgInfo,
        resizedUrl: result.url,
        resizedWidth: result.width,
        resizedHeight: result.height,
        resizedBlob: result.blob,
        isProcessing: false
      };

      setImages(prev => prev.map(img => {
        if (img.id === id) {
          if (img.resizedUrl !== img.originalUrl) {
            URL.revokeObjectURL(img.resizedUrl);
            allGeneratedUrls.current.delete(img.resizedUrl);
          }
          return updatedImg;
        }
        return img;
      }));

      return updatedImg;
    } catch (error) {
      console.error(`Error processing image ${id}:`, error);
      setImages(prev => prev.map(img => img.id === id ? { ...img, isProcessing: false } : img));
      return null;
    } finally {
      processingRef.current.delete(id);
    }
  }, []);

  const processAll = useCallback(async (currentSettings: ResizeSettings) => {
    // Process images sequentially or in small chunks to avoid memory/canvas issues
    const results: ResizedImage[] = [];
    for (const img of imagesRef.current) {
      const res = await processSingleImage(img.id, currentSettings);
      if (res) results.push(res);
    }
    return results;
  }, [processSingleImage]);

  useEffect(() => {
    return () => {
      allGeneratedUrls.current.forEach(url => URL.revokeObjectURL(url));
      allGeneratedUrls.current.clear();
    };
  }, []);

  return {
    images,
    processSingleImage,
    processAll
  };
}
