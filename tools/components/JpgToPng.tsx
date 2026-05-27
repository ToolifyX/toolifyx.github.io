"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function JpgToPng() {
  return (
    <ImageConvertBase
      fromFormat="image/jpeg"
      toFormat="image/png"
      toExtension="png"
      title="JPG to PNG Converter"
    />
  );
}
