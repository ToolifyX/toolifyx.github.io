"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function ConvertToWebp() {
  return (
    <ImageConvertBase
      fromFormat="image/*"
      toFormat="image/webp"
      toExtension="webp"
      title="Convert to WebP"
    />
  );
}
