"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function WebpToJpg() {
  return (
    <ImageConvertBase
      fromFormat="image/webp"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="WebP to JPG Converter"
    />
  );
}
