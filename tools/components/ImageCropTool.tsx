"use client";

/**
 * SEO Title: Image Cropper - Crop Photos Online for Free
 * Meta Description: Crop your images easily with our free online tool. Support for various aspect ratios, interactive resizing, and high-quality export.
 *
 * FAQ 1: Is this tool free to use?
 * Yes, our Image Cropper is 100% free and works entirely in your browser.
 *
 * FAQ 2: What formats are supported?
 * You can upload and crop JPG, PNG, and WebP images.
 *
 * FAQ 3: Are my images safe?
 * Your images are processed locally in your browser and are never uploaded to our servers.
 */

import React, { useState, useCallback } from 'react';
import ImageUploader from '@/components/ImageUploader';
import CropEditor from './ImageCropTool/CropEditor';
import CropControls from './ImageCropTool/CropControls';
import { useCropEngine } from './ImageCropTool/useCropEngine';
import { getCroppedImg } from './ImageCropTool/cropUtils';
import { downloadFile } from '@/lib/utils';
import { X } from 'lucide-react';

export default function ImageCropTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    crop,
    setCrop,
    aspect,
    setAspect,
    zoom,
    setZoom,
    flip,
    toggleFlip,
    resetCrop,
  } = useCropEngine(imageElement);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImageDataUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!imageElement || !crop) return;
    setIsProcessing(true);
    try {
      const { blob } = await getCroppedImg(
        imageElement,
        crop,
        imageFile?.name || 'cropped-image.jpg',
        flip
      );
      downloadFile(blob, `cropped_${imageFile?.name || 'image.jpg'}`);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setImageElement(null);
  };

  if (!imageDataUrl) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <ImageUploader maxFiles={1} onChange={handleFileChange} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:flex-row overflow-hidden mt-16 lg:mt-0">
      {/* Header for mobile or tool identifier */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={clearImage}
          className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Area (Left) */}
      <div className="flex-1 relative bg-black/5 flex items-center justify-center overflow-hidden">
        <CropEditor
          image={imageDataUrl}
          crop={crop}
          setCrop={setCrop}
          aspect={aspect}
          zoom={zoom}
          flip={flip}
          onImageLoad={setImageElement}
        />
      </div>

      {/* Controls Area (Right) */}
      <div className="w-full md:w-80 h-auto md:h-full shrink-0">
        <CropControls
          aspect={aspect}
          setAspect={setAspect}
          zoom={zoom}
          setZoom={setZoom}
          flip={flip}
          toggleFlip={toggleFlip}
          onReset={resetCrop}
          onDownload={handleDownload}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}
