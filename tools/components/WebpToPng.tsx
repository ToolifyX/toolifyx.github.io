"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function WebpToPng() {
  return (
    <ImageConvertBase
      fromFormat="image/webp"
      toFormat="image/png"
      toExtension="png"
      title="WebP to PNG Converter"
    />
  );
}
