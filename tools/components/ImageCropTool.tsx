"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Upload, ImageIcon, RotateCcw, Download, Archive, Loader2, Undo2, Maximize2, Layers, Crop, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import AspectRatioSelector, { aspectRatios, socialPresets, AspectRatio } from '@/components/crop/AspectRatioSelector';
import CropCanvas, { CropArea } from '@/components/crop/CropCanvas';
import { cropImage } from '@/lib/imageConverter';
import { ProcessedResult } from '@/lib/imagePipeline';
import { downloadFile } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';

type ToolStatus = 'idle' | 'ready' | 'cropping' | 'done';

export default function ImageCropTool() {
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeRatio, setActiveRatio] = useState<AspectRatio>(aspectRatios[0]);
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setStatus('ready');
      setResults([]);
    }
  };

  const handleApplyCrop = async () => {
    if (!selectedImage) return;
    setStatus('cropping');

    const ratiosToProcess = selectedPresets.length > 0
      ? [...aspectRatios, ...socialPresets].filter(r => selectedPresets.includes(r.id))
      : [activeRatio];

    setProgress({ current: 0, total: ratiosToProcess.length });
    const newResults: ProcessedResult[] = [];

    for (let i = 0; i < ratiosToProcess.length; i++) {
      const ratio = ratiosToProcess[i];
      setProgress(prev => ({ ...prev, current: i + 1 }));

      const result = await cropImage(selectedImage, cropArea);
      newResults.push({
        blob: result.blob,
        name: `${ratio.id}-${result.name}`,
        url: URL.createObjectURL(result.blob),
        originalSize: selectedImage.size,
        compressedSize: result.blob.size,
        width: result.width,
        height: result.height
      });
    }

    setResults(newResults);
    setStatus('done');
  };

  const handleReset = () => {
    setSelectedImage(null);
    setStatus('idle');
    setResults([]);
    setActiveRatio(aspectRatios[0]);
    setSelectedPresets([]);
  };

  const leftPanel = (
    <div className="flex flex-col gap-2">
      <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
        <Crop className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Crop</span>
      </button>
      <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-muted text-muted-foreground transition-all">
        <RotateCw className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Rotate</span>
      </button>
      <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-muted text-muted-foreground transition-all">
        <FlipHorizontal className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Flip</span>
      </button>
      <div className="h-px bg-border my-2" />
      <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
        <Undo2 className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-black uppercase">Reset</span>
      </button>
    </div>
  );

  const rightPanel = (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Dimensions</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase">Width %</label>
            <input
                type="number"
                value={Math.round(cropArea.width)}
                readOnly
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase">Height %</label>
            <input
                type="number"
                value={Math.round(cropArea.height)}
                readOnly
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs font-bold"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground border-b pb-2">Presets</h3>
        <AspectRatioSelector
          title="Standard"
          items={aspectRatios}
          selectedIds={selectedPresets}
          activeId={activeRatio.id}
          onChange={(r) => { setSelectedPresets([]); setActiveRatio(r); }}
        />
        <AspectRatioSelector
          title="Social Media"
          items={socialPresets}
          selectedIds={selectedPresets}
          activeId={activeRatio.id}
          onChange={(r) => { setSelectedPresets([]); setActiveRatio(r); }}
        />
      </div>

      <div className="pt-6">
        <button
          onClick={handleApplyCrop}
          disabled={status !== 'ready'}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {status === 'cropping' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crop Image'}
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full relative flex items-center justify-center">
      {!selectedImage ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('crop-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Select image to crop</h4>
            <p className="text-sm text-muted-foreground font-medium">Supports JPG, PNG, WebP (Max 20MB)</p>
          </div>
          <input
            id="crop-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <CropCanvas
          image={selectedImage}
          aspectRatio={activeRatio.value}
          onCropChange={setCropArea}
          status={status}
        />
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName="Image Cropper"
      fileName={selectedImage?.name}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      onDownload={status === 'done' ? handleApplyCrop : undefined}
    />
  );
}
