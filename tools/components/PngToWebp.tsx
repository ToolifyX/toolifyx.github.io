"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function PngToWebp() {
  return (
    <ImageConvertBase
      fromFormat="image/png"
      toFormat="image/webp"
      toExtension="webp"
      title="PNG to WebP Converter"
    />
  );
}
