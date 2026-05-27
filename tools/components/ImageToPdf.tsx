"use client";

/**
 * SEO Title: Image to PDF - Convert JPG/PNG to PDF Online
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { Loader2, FileText } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import ResultPanel from '@/components/tool-layout/ResultPanel';

export default function ImageToPdf() {
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

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <UploadPanel files={files} onChange={setFiles} />
      {files.length > 0 && (
        <button
          onClick={convertToPdf}
          disabled={isProcessing}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Generate PDF from {files.length} Images
        </button>
      )}

      {isProcessing && (
        <ResultPanel
          isProcessing={isProcessing}
          results={[]}
          onDownload={() => {}}
          onDownloadAll={() => {}}
        />
      )}
    </div>
  );
}
