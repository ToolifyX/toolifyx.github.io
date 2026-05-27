"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function SvgToPng({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/svg+xml"
      toFormat="image/png"
      toExtension="png"
      title="SVG to PNG Converter"
      tool={tool}
    />
  );
}
