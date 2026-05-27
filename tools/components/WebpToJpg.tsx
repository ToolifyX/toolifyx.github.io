"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function WebpToJpg({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/webp"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="WebP to JPG Converter"
      tool={tool}
    />
  );
}
