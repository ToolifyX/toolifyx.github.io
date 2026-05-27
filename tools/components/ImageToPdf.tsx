"use client";

/**
 * SEO Title: Image to PDF - Convert JPG/PNG to PDF Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, FileImage, FileText, Zap } from 'lucide-react';
import EditorLayout from '@/components/tool-layout/EditorLayout';
import FileList from '@/components/tool-layout/FileList';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import { Tool } from '@/tools/types';

export default function ImageToPdf({ tool }: { tool?: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string, url: string } | null>(null);

  const convertToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResult({
        blob,
        name: 'images-converted.pdf',
        url: URL.createObjectURL(blob)
      });
    } catch (err) {
      console.error(err);
      alert('Error converting images to PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
  };

  if (result && !isProcessing) {
    const mockProcessedResult = {
      blob: result.blob,
      url: result.url,
      name: result.name,
      originalSize: files.reduce((acc, f) => acc + f.size, 0),
      compressedSize: result.blob.size,
      width: 0,
      height: 0
    };

    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={[mockProcessedResult]}
          onReset={handleReset}
          onDownload={(res) => downloadFile(res.blob, res.name)}
          onDownloadAll={() => downloadFile(result.blob, result.name)}
          title="Image to PDF Converted"
        />
      </div>
    );
  }

  const leftPanel = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <button
          onClick={convertToPdf}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all"
        >
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-black uppercase">Create PDF</span>
        </button>
        <div className="h-px bg-border my-2" />
        <button onClick={handleReset} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
          <Zap className="w-5 h-5 mb-1" />
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

  const rightPanel = (
    <ResultPanel
      isProcessing={isProcessing}
      results={[]}
      onDownload={() => {}}
      onDownloadAll={() => {}}
      emptyMessage="PDF result will appear here"
    />
  );

  const mainCanvas = (
    <div className="w-full h-full flex items-center justify-center p-8">
      {files.length === 0 ? (
        <div
          className="w-full max-w-lg border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-6 hover:border-primary transition-all cursor-pointer bg-card/50 hover:bg-card group"
          onClick={() => document.getElementById('pdf-upload')?.click()}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3">
             <FileImage className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Upload images for PDF</h4>
            <p className="text-sm text-muted-foreground font-medium">Combine multiple images into a single PDF document</p>
          </div>
          <input id="pdf-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
          }} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
           <div className="w-32 h-32 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative">
              <FileImage className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-full shadow-lg">
                {files.length}
              </div>
           </div>
           <div className="text-center space-y-1">
              <h4 className="text-xl font-bold uppercase tracking-tight">Images ready for PDF</h4>
              <p className="text-sm text-muted-foreground font-medium uppercase">
                {files.length} files selected
              </p>
           </div>
           <button
             onClick={() => document.getElementById('pdf-upload')?.click()}
             className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
           >
             Add more files
           </button>
           <input id="pdf-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => {
             const newFiles = Array.from(e.target.files || []);
             if (newFiles.length > 0) setFiles(prev => [...prev, ...newFiles]);
           }} />
        </div>
      )}
    </div>
  );

  return (
    <EditorLayout
      toolName={tool?.title || "Image to PDF"}
      toolIcon={tool?.icon}
      fileName={files.length === 1 ? files[0].name : files.length > 1 ? `${files.length} Files selected` : undefined}
      leftPanel={leftPanel}
      mainCanvas={mainCanvas}
      rightPanel={rightPanel}
      onDownload={result ? () => downloadFile(result.blob, result.name) : undefined}
    />
  );
}
