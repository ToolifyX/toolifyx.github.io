"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function HeicToJpg({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/heic"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="HEIC to JPG Converter"
      tool={tool}
    />
  );
}
