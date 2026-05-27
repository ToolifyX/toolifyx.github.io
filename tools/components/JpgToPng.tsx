"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function JpgToPng({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/jpeg"
      toFormat="image/png"
      toExtension="png"
      title="JPG to PNG Converter"
      tool={tool}
    />
  );
}
