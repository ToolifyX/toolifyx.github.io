"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function HeicToJpg() {
  return (
    <ImageConvertBase
      fromFormat="image/heic"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="HEIC to JPG Converter"
    />
  );
}
