"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function JpgToWebp() {
  return (
    <ImageConvertBase
      fromFormat="image/jpeg"
      toFormat="image/webp"
      toExtension="webp"
      title="JPG to WebP Converter"
    />
  );
}
