"use client";

import React from 'react';
import { ResizedImage } from './useBatchResizeEngine';
import { Loader2, Download, FileImage, ArrowRight } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { ResizeSettings, calculateNewDimensions } from './resizeUtils';

interface ResizeGalleryProps {
  images: ResizedImage[];
  settings: ResizeSettings;
  onDownload: (img: ResizedImage) => void;
}

export default function ResizeGallery({ images, settings, onDownload }: ResizeGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12">
        <FileImage className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Upload images to start resizing</p>
        <p className="text-sm">Your resized previews will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {images.map((img) => {
        const { width: targetWidth, height: targetHeight } = calculateNewDimensions(
          img.originalWidth,
          img.originalHeight,
          settings
        );

        return (
          <div key={img.id} className="group relative bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="aspect-square relative bg-muted/30 flex items-center justify-center overflow-hidden">
              <img
                src={img.originalUrl}
                alt={img.file.name}
                className="max-w-full max-h-full object-contain opacity-100"
              />

              {/* Resolution Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="px-2 py-1 bg-black/70 backdrop-blur-md text-[10px] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-lg">
                  <span>{img.originalWidth > 0 ? `${img.originalWidth}x${img.originalHeight}` : '...'}</span>
                  <ArrowRight className="w-3 h-3 text-white/50" />
                  <span className="text-primary">{img.originalWidth > 0 ? `${targetWidth}x${targetHeight}` : '...'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-foreground mb-0.5">{img.file.name}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {formatBytes(img.file.size)} → {settings.format.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => onDownload(img)}
                  className="shrink-0 p-2.5 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all"
                  title="Download this image"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
