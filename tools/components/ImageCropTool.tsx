"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Upload, ImageIcon, RotateCcw, Download, Archive, Loader2, Undo2, Maximize2, Layers } from 'lucide-react';
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
  const [showOriginal, setShowOriginal] = useState(false);

  // For live preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (results.length > 0) {
      setPreviewUrl(results[0].url);
    } else {
      setPreviewUrl(null);
    }
  }, [results]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20MB limit.");
        return;
      }
      setSelectedImage(file);
      setStatus('ready');
      setResults([]);
    }
  };

  const togglePreset = (ratio: AspectRatio) => {
    if (ratio.id === 'free') {
      setSelectedPresets([]);
      setActiveRatio(ratio);
      return;
    }

    setSelectedPresets(prev => {
      if (prev.includes(ratio.id)) return prev.filter(id => id !== ratio.id);
      return [...prev, ratio.id];
    });
    setActiveRatio(ratio);
  };

  const handleApplyCrop = async () => {
    if (!selectedImage) return;
    setStatus('cropping');

    const ratiosToProcess = selectedPresets.length > 0
      ? [...aspectRatios, ...socialPresets].filter(r => selectedPresets.includes(r.id))
      : [activeRatio];

    setProgress({ current: 0, total: ratiosToProcess.length });
    const newResults: ProcessedResult[] = [];

    // Revoke old URLs
    results.forEach(r => URL.revokeObjectURL(r.url));

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

  const handleDownload = (res: ProcessedResult) => {
    downloadFile(res.blob, res.name);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        "cropped-images.zip"
      );
    } finally {
      setIsZipping(false);
    }
  };

  const leftPanel = (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Maximize2 className="w-3 h-3" /> Aspect Ratio
        </h3>
        <AspectRatioSelector
          title="Standard"
          items={aspectRatios}
          selectedIds={selectedPresets}
          activeId={activeRatio.id}
          onChange={togglePreset}
        />
        <AspectRatioSelector
          title="Social Media"
          items={socialPresets}
          selectedIds={selectedPresets}
          activeId={activeRatio.id}
          onChange={togglePreset}
        />
      </div>

      <div className="space-y-2 pt-4 border-t">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Information</h3>
        <div className="p-4 bg-card border rounded-xl space-y-3">
          {selectedImage ? (
            <div className="space-y-2">
              <p className="text-xs font-bold truncate uppercase">{selectedImage.name}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No image uploaded</p>
          )}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
        >
          <Undo2 className="w-3.5 h-3.5" /> Reset Image
        </button>
      </div>
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center relative">
      {!selectedImage ? (
        <div
          className="w-full max-w-xl border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('crop-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Select image to crop</h4>
            <p className="text-sm text-muted-foreground font-medium">Supports JPG, PNG, WebP, HEIC (Max 20MB)</p>
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
        <div className="w-full h-full flex items-center justify-center p-4">
          <CropCanvas
            image={selectedImage}
            aspectRatio={activeRatio.value}
            onCropChange={setCropArea}
            status={status}
          />
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Layers className="w-3 h-3" /> Result Preview
          </h3>
          {status === 'done' && (
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-muted hover:bg-border transition-colors"
            >
              Hold for Original
            </button>
          )}
        </div>

        <div className="aspect-square bg-muted/30 border border-border rounded-2xl flex items-center justify-center overflow-hidden relative">
          {status === 'done' && previewUrl ? (
            <img
              src={showOriginal && selectedImage ? URL.createObjectURL(selectedImage) : previewUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain animate-in fade-in duration-300"
            />
          ) : (
            <div className="text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-muted/30 mx-auto" />
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Awaiting process</p>
            </div>
          )}
        </div>

        {status === 'done' && results.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {results.map((res, i) => (
              <button
                key={i}
                onClick={() => setPreviewUrl(res.url)}
                className={`aspect-square rounded-md border-2 overflow-hidden hover:opacity-80 transition-all ${previewUrl === res.url ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={res.url} alt={`Res ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        {status === 'done' ? (
          <div className="space-y-3">
            <button
              onClick={results.length > 1 ? handleDownloadAll : () => handleDownload(results[0])}
              disabled={isZipping}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {results.length > 1 ? `Download All (${results.length})` : 'Download Result'}
            </button>

            {results.length > 1 && (
              <p className="text-[10px] text-center text-muted-foreground font-medium">Files will be packaged into a .zip archive</p>
            )}
          </div>
        ) : (
          <button
            onClick={handleApplyCrop}
            disabled={status !== 'ready' || status === 'cropping'}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:grayscale"
          >
            {status === 'cropping' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Apply Changes'
            )}
          </button>
        )}
      </div>
    </div>
  );

  const bottomBar = selectedImage ? (
    <>
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Size</span>
          <span className="text-xs font-bold">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        {status === 'done' && results.length === 1 && (
           <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Size</span>
            <span className="text-xs font-bold text-primary">{(results[0].blob.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
         <button onClick={handleReset} className="px-4 py-2 text-xs font-bold hover:bg-muted rounded-lg transition-colors">
            Reset
         </button>
         <button
          onClick={handleApplyCrop}
          disabled={status === 'cropping'}
          className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
         >
           {status === 'done' ? 'Re-Apply' : 'Apply Changes'}
         </button>
      </div>
    </>
  ) : null;

  return (
    <EditorLayout
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      bottomBar={bottomBar}
    />
  );
}
