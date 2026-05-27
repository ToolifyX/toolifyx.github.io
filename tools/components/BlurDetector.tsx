"use client";

/**
 * SEO Title: Image Blur Detector - Check Image Sharpness Online
 * Meta Description: Analyze your photos to detect if they are blurry or sharp. Uses edge detection to estimate sharpness.
 *
 * FAQ 1: How does it detect blur?
 * It uses a Sobel filter to find edges in the image. More sharp edges generally mean a sharper image.
 *
 * FAQ 2: What is the score?
 * A higher score indicates more detail/sharpness. Scores below 10-20 often suggest a blurry image.
 *
 * FAQ 3: Is it 100% accurate?
 * It's a mathematical estimate based on contrast. Artistic blur or dark images might return lower scores.
 */

import React, { useState, useRef } from 'react';

export default function BlurDetector() {
  const [image, setImage] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImage(src);
        detectBlur(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectBlur = (src: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Small sample for performance
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
      const imageData = ctx.getImageData(0, 0, 300, 300);
      const data = imageData.data;

      // Greyscale + Sobel-like edge detection
      let sum = 0;
      for (let i = 0; i < data.length - 4; i += 4) {
        const gray1 = (data[i] + data[i+1] + data[i+2]) / 3;
        const gray2 = (data[i+4] + data[i+5] + data[i+6]) / 3;
        sum += Math.abs(gray1 - gray2);
      }

      const sharpness = sum / (300 * 300);
      setScore(parseFloat(sharpness.toFixed(2)));
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />

        {image && (
          <div className="space-y-4">
            {score !== null && (
              <div className={`p-6 rounded border text-center ${score > 15 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="text-4xl font-bold">{score}</div>
                <div className="text-sm font-medium uppercase mt-1">Sharpness Score</div>
                <p className="text-xs text-gray-500 mt-2">
                  {score > 15 ? "This image looks relatively sharp." : "This image might be blurry or has low contrast."}
                </p>
              </div>
            )}
            <img src={image} alt="Preview" className="max-w-full h-auto rounded border mx-auto" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
