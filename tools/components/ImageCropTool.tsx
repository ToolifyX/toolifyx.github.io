"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, RotateCcw, Download, Archive, Loader2 } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import AspectRatioSelector, { aspectRatios, socialPresets, AspectRatio } from '@/components/crop/AspectRatioSelector';
import CropCanvas, { CropArea } from '@/components/crop/CropCanvas';
import CropControls from '@/components/crop/CropControls';
import ResultScreen from '@/components/tool-layout/ResultScreen';
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
      if (file.size > 15 * 1024 * 1024) {
        alert("File size exceeds 15MB limit.");
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

  const handleCrop = async () => {
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

        // For presets, we might want to auto-center the crop if possible
        // But for now, use current cropArea or a standard center crop for the ratio
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

  if (status === 'done') {
    return (
      <div className="max-w-4xl mx-auto">
        <ResultScreen
          results={results}
          onReset={() => setStatus('ready')}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          isZipping={isZipping}
          title="Crop Completed"
        />
        <div className="mt-8 flex justify-center">
            <button
                onClick={handleReset}
                className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
                <RotateCcw className="w-4 h-4" />
                Crop New Image
            </button>
        </div>
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-6">
      {!selectedImage ? (
        <div
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 hover:border-primary transition-colors cursor-pointer bg-muted/20"
          onClick={() => document.getElementById('crop-upload')?.click()}
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold">Upload image to crop</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Max 15MB • Single Image</p>
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
        <div className="bg-card border border-border rounded-2xl p-6 space-y-8 animate-in fade-in duration-300">
           <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate uppercase tracking-tight">{selectedImage.name}</p>
                <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={handleReset} className="text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
           </div>

           <AspectRatioSelector
             title="Standard Ratios"
             items={aspectRatios}
             selectedIds={selectedPresets}
             activeId={activeRatio.id}
             onChange={togglePreset}
           />

           <AspectRatioSelector
             title="Social Presets"
             items={socialPresets}
             selectedIds={selectedPresets}
             activeId={activeRatio.id}
             onChange={togglePreset}
           />

           {selectedPresets.length > 0 && (
             <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Batch Queue: {selectedPresets.length} formats selected
                </p>
             </div>
           )}

           <div className="pt-4 border-t border-border">
              <div className="space-y-4">
                {status === 'cropping' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>Processing {progress.current}/{progress.total}</span>
                            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
                <CropControls onCrop={handleCrop} onReset={() => setStatus('ready')} status={status} />
              </div>
           </div>
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <div className="h-full min-h-[500px]">
        <CropCanvas
            image={selectedImage}
            aspectRatio={activeRatio.value}
            onCropChange={setCropArea}
            status={status}
        />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <ToolSplitLayout left={leftPanel} right={rightPanel} />
    </div>
  );
}
