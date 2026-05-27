"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function AvifToJpg() {
  return (
    <ImageConvertBase
      fromFormat="image/avif"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="AVIF to JPG Converter"
    />
  );
}
