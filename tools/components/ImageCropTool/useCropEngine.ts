import { useState, useCallback, useEffect } from 'react';
import { CropArea } from './cropUtils';

export interface AspectRatio {
  label: string;
  value: number | null;
}

export const aspectRatios: AspectRatio[] = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
];

export function useCropEngine(imageElement: HTMLImageElement | null) {
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspect, setAspect] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });

  const resetCrop = useCallback(() => {
    if (!imageElement) return;
    const { width, height } = imageElement;

    let cropWidth, cropHeight;
    if (aspect) {
      if (width / height > aspect) {
        cropHeight = height * 0.8;
        cropWidth = cropHeight * aspect;
      } else {
        cropWidth = width * 0.8;
        cropHeight = cropWidth / aspect;
      }
    } else {
      cropWidth = width * 0.8;
      cropHeight = height * 0.8;
    }

    setCrop({
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    });
    setZoom(1);
    setFlip({ horizontal: false, vertical: false });
  }, [imageElement, aspect]);

  useEffect(() => {
    if (imageElement) {
      resetCrop();
    }
  }, [imageElement, aspect, resetCrop]);

  const updateCrop = useCallback((newCrop: Partial<CropArea>) => {
    setCrop((prev) => ({ ...prev, ...newCrop }));
  }, []);

  const toggleFlip = useCallback((direction: 'horizontal' | 'vertical') => {
    setFlip(prev => ({
      ...prev,
      [direction]: !prev[direction]
    }));
  }, []);

  return {
    crop,
    setCrop: updateCrop,
    aspect,
    setAspect,
    zoom,
    setZoom,
    flip,
    toggleFlip,
    resetCrop,
  };
}
