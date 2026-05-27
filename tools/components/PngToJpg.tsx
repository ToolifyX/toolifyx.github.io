"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

import { Tool } from '@/tools/types';

export default function PngToJpg({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/png"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="PNG to JPG Converter"
      tool={tool}
    />
  );
}
