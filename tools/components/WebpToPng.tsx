"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function WebpToPng({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/webp"
      toFormat="image/png"
      toExtension="png"
      title="WebP to PNG Converter"
      tool={tool}
    />
  );
}
