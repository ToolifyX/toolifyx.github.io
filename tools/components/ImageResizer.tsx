"use client";

/**
 * SEO Title: Professional Image Resizer - Resize Multiple Images Online
 * Meta Description: Resize your images to any dimension or percentage instantly. Bulk image resizing with real-time preview. 100% free and private.
 */

import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ResizeGallery from './ImageResizerTool/ResizeGallery';
import ResizeControls from './ImageResizerTool/ResizeControls';
import { useBatchResizeEngine, ResizedImage } from './ImageResizerTool/useBatchResizeEngine';
import { ResizeSettings, ImageInfo } from './ImageResizerTool/resizeUtils';
import { downloadFile, formatBytes } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import { X, Plus, Loader2 } from 'lucide-react';

export default function ImageResizer() {
  const [initialImages, setInitialImages] = useState<ImageInfo[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [settings, setSettings] = useState<ResizeSettings>({
    mode: 'percentage',
    percentage: 50,
    width: 1920,
    height: 1080,
    maintainAspectRatio: true,
    noEnlarge: true,
    format: 'png',
    quality: 90
  });

  const { images, processSingleImage, processAll } = useBatchResizeEngine(initialImages, settings);

  const handleFileChange = (files: File[]) => {
    const newInfos = files.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      originalUrl: URL.createObjectURL(file),
      originalWidth: 0,
      originalHeight: 0,
      originalSize: file.size
    }));

    // Pre-load images to get dimensions
    newInfos.forEach(info => {
      const img = new Image();
      img.onload = () => {
        setInitialImages(prev => prev.map(p => p.id === info.id ? {
          ...p,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight
        } : p));
      };
      img.src = info.originalUrl;
    });

    setInitialImages(prev => [...prev, ...newInfos]);
  };

  const handleRemoveImage = (id: string) => {
    setInitialImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.originalUrl);
      return filtered;
    });
  };

  const clearImages = () => {
    initialImages.forEach(img => URL.revokeObjectURL(img.originalUrl));
    setInitialImages([]);
  };

  const handleDownload = async (img: ResizedImage) => {
    setIsProcessing(true);
    try {
      const processed = await processSingleImage(img.id, settings);
      if (processed && processed.resizedBlob) {
        const ext = settings.format === 'jpeg' ? 'jpg' : settings.format;
        downloadFile(processed.resizedBlob, `resized_${img.file.name.replace(/\.[^/.]+$/, "")}.${ext}`);
      }
    } catch (error) {
      console.error("Single download failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setIsZipping(true);
    try {
      const processedImages = await processAll(settings);
      const zipItems = processedImages
        .filter(img => img.resizedBlob)
        .map(img => {
          const ext = settings.format === 'jpeg' ? 'jpg' : settings.format;
          return {
            name: `resized_${img.file.name.replace(/\.[^/.]+$/, "")}.${ext}`,
            blob: img.resizedBlob!
          };
        });

      if (zipItems.length > 0) {
        await downloadAllAsZip(zipItems, "toolifyx-resized-images.zip");
      } else {
        alert("Failed to process images for download.");
      }
    } catch (error) {
      console.error("Batch download failed:", error);
      alert("An error occurred during batch processing.");
    } finally {
      setIsZipping(false);
      setIsProcessing(false);
    }
  };

  if (initialImages.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <ImageUploader maxFiles={500} onChange={handleFileChange} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:flex-row overflow-hidden mt-16 lg:mt-0">
      {/* Processing Overlay */}
      {(isProcessing || isZipping) && (
        <div className="absolute inset-0 z-[100] bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-8 rounded-3xl shadow-2xl border flex flex-col items-center gap-6 min-w-[300px]">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-black text-lg uppercase tracking-wider">Processing Batch</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Applying settings to {images.length} images</p>
            </div>
          </div>
        </div>
      )}

      {/* Header for mobile or tool identifier */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={clearImages}
          className="p-2.5 bg-black/80 hover:bg-black text-white rounded-full transition-all backdrop-blur-md shadow-xl active:scale-90"
          title="Clear all images"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="h-10 px-4 bg-black/80 backdrop-blur-md text-white rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">{initialImages.length} Images Ready</span>
        </div>
      </div>

      {/* Main Workspace (Left) */}
      <div className="flex-1 relative bg-muted/20 overflow-y-auto custom-scrollbar">
        <div className="min-h-full pb-28 pt-20">
          <ResizeGallery
            images={images}
            settings={settings}
            onDownload={handleDownload}
            onRemove={handleRemoveImage}
          />
        </div>

        {/* Floating Add More Button */}
        <label className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-[calc(50%-160px)] z-20 cursor-pointer">
           <input type="file" multiple className="hidden" onChange={(e) => handleFileChange(Array.from(e.target.files || []))} />
           <div className="flex items-center gap-3 px-8 py-3.5 bg-white dark:bg-zinc-900 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-black text-sm transition-all shadow-2xl active:scale-95 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Add More Images
           </div>
        </label>
      </div>

      {/* Controls Panel (Right) */}
      <div className="w-full md:w-80 h-auto md:h-full shrink-0 shadow-2xl z-30">
        <ResizeControls
          settings={settings}
          setSettings={setSettings}
          onDownloadAll={handleDownloadAll}
          isProcessing={isZipping || isProcessing}
          hasImages={images.length > 0}
        />
      </div>
    </div>
  );
}
