"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function SvgToPng() {
  return (
    <ImageConvertBase
      fromFormat="image/svg+xml"
      toFormat="image/png"
      toExtension="png"
      title="SVG to PNG Converter"
    />
  );
}
