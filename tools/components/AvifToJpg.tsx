"use client";

import React from 'react';
import ImageConvertBase from '@/components/tool-layout/ImageConvertBase';
import { Tool } from '@/tools/types';

export default function AvifToJpg({ tool }: { tool?: Tool }) {
  return (
    <ImageConvertBase
      fromFormat="image/avif"
      toFormat="image/jpeg"
      toExtension="jpg"
      title="AVIF to JPG Converter"
      tool={tool}
    />
  );
}
