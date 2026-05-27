"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';

export default function ConvertToJpg() {
  return (
    <ImageConvertBase
      fromFormat="image/*"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="Convert to JPG"
    />
  );
}
