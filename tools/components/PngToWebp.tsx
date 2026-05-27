"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function PngToWebp({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/png"
      toFormat="image/webp"
      toExtension="webp"
      title="PNG to WebP Converter"
      tool={tool}
    />
  );
}
