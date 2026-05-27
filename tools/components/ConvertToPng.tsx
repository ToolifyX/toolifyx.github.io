"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function ConvertToPng() {
  return (
    <ImageConvertBase
      fromFormat="image/*"
      toFormat="image/png"
      toExtension="png"
      title="Convert to PNG"
    />
  );
}
