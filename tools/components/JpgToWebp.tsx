"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function JpgToWebp({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/jpeg"
      toFormat="image/webp"
      toExtension="webp"
      title="JPG to WebP Converter"
      tool={tool}
    />
  );
}
