"use client";

import React, { useState, useEffect } from 'react';
import { downloadFile } from '@/lib/utils';
import { convertImage, ConversionResult } from '@/lib/imageConverter';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadAllAsZip } from '@/lib/download';
import { Loader2, Zap, RotateCcw } from 'lucide-react';
import ToolSplitLayout from '@/components/tool-layout/ToolSplitLayout';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import { ProcessedResult } from '@/lib/imagePipeline';

import EditorLayout from '@/components/tool-layout/EditorLayout';
import FileList from '@/components/tool-layout/FileList';
import { Tool } from '@/tools/types';

type ToolStatus = 'idle' | 'processing' | 'done';

interface ImageConvertBaseProps {
  fromFormat: string;
  toFormat: string;
  toExtension: string;
  title: string;
  tool?: Tool;
}

export default function ImageConvertBase({ fromFormat, toFormat, toExtension, title, tool }: ImageConvertBaseProps) {
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [limits, setLimits] = useState<UploadLimits | null>(null);

  useEffect(() => {
    setLimits(getUploadLimits());
  }, []);

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setResults([]);

    const newResults: ProcessedResult[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({ current: i + 1, total: files.length });
      try {
        const result: ConversionResult = await convertImage(files[i], toFormat);
        newResults.push({
          blob: result.blob,
          name: result.name,
          url: URL.createObjectURL(result.blob),
          originalSize: files[i].size,
          compressedSize: result.blob.size,
          width: result.width,
          height: result.height
        });
      } catch (error) {
        console.error("Conversion failed for file:", files[i].name, error);
      }
    }

    setResults(newResults);
    setStatus('done');
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
  };

  const handleDownloadResult = (res: ProcessedResult) => {
    downloadFile(res.blob, res.name);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);
    try {
      await downloadAllAsZip(
        results.map(r => ({ name: r.name, blob: r.blob })),
        `converted-${toExtension}-images.zip`
      );
    } finally {
      setIsZipping(false);
    }
  };

  if (status === 'done') {
    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={results}
          onReset={handleReset}
          onDownload={handleDownloadResult}
          onDownloadAll={handleDownloadAll}
          isZipping={isZipping}
          title={title}
        />
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
          <Zap className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Convert</span>
        </button>
        <div className="h-px bg-border my-2" />
        <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
          <RotateCcw className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Reset</span>
        </button>
      </div>

      {files.length > 0 && (
        <div className="pt-4 border-t border-border">
          <FileList
            files={files}
            onRemove={(idx) => setFiles(prev => prev.filter((_, i) => i !== idx))}
            onClear={() => setFiles([])}
          />
        </div>
      )}
    </div>
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('convert-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <Zap className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images to convert</h4>
            <p className="text-sm text-muted-foreground font-medium">Batch process {fromFormat.toUpperCase()} to {toExtension.toUpperCase()}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
           <div className="w-32 h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative">
              <Zap className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-full shadow-lg">
                {files.length}
              </div>
           </div>
           <div className="text-center space-y-1">
              <h4 className="text-xl font-bold uppercase tracking-tight">Ready for {toExtension.toUpperCase()} conversion</h4>
              <p className="text-sm text-muted-foreground font-medium uppercase">
                {files.length} files selected
              </p>
           </div>
           <button
             onClick={() => document.getElementById('convert-upload')?.click()}
             className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
           >
             Add more files
           </button>
           <input id="convert-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
             const newFiles = Array.from(e.target.files || []);
             if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
           }} />
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <ResultPanel
      isProcessing={status === 'processing'}
      results={results}
      progress={progress}
      onDownload={handleDownloadResult}
      onDownloadAll={handleDownloadAll}
      isZipping={isZipping}
      emptyMessage={`Your ${toExtension.toUpperCase()} files will appear here`}
    />
  );

  return (
    <EditorLayout
      toolName={tool?.title || title}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : files.length > 1 ? `${files.length} Files selected` : undefined}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      onDownload={(status as string) === 'done' ? handleDownloadAll : undefined}
    />
  );
}
