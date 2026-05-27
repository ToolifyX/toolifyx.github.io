"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function PngToJpg() {
  return (
    <ImageConvertBase
      fromFormat="image/png"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="PNG to JPG Converter"
    />
  );
}
