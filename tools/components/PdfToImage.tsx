"use client";

/**
 * SEO Title: PDF to Image Converter - Convert PDF to JPG or PNG Online
 * Meta Description: High-quality PDF to image converter. Convert PDF pages to JPG or PNG images instantly in your browser. Batch export and quality control.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, Settings2, Image as ImageIcon, FileText } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { getUploadLimits, UploadLimits } from '@/lib/adaptiveUpload';
import { downloadFile, formatBytes } from '@/lib/utils';
import { Tool } from '@/tools/types';
import JSZip from 'jszip';

interface Props {
  tool: Tool;
}

export default function PdfToImage({ tool }: Props) {
  const isPng = tool.slug === 'pdf-to-png';
  const format = isPng ? 'image/png' : 'image/jpeg';
  const extension = isPng ? 'png' : 'jpg';

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ name: string, blob: Blob, url: string }[]>([]);
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [quality, setQuality] = useState(0.9);
  const [dpi, setDpi] = useState(150);

  useEffect(() => {
    // Load PDF.js from CDN
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjs(pdfjsLib);
      };
      document.body.appendChild(script);
    }
  }, []);

  const convertPdfToImages = async (file: File) => {
    if (!pdfjs) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const images = [];

    for (let i = 1; i <= numPages; i++) {
      setProgress(Math.round((i / numPages) * 100));
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: dpi / 72 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));
      if (blob) {
        images.push({
          name: `${file.name.replace(/\.pdf$/i, '')}_page_${i}.${extension}`,
          blob,
          url: URL.createObjectURL(blob)
        });
      }
    }
    return images;
  };

  const handleConvert = async () => {
    if (files.length === 0 || !pdfjs) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const allResults = [];
      for (const file of files) {
        const images = await convertPdfToImages(file);
        if (images) allResults.push(...images);
      }
      setResults(allResults);
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF. Ensure it's not password protected.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownloadZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    results.forEach(res => zip.file(res.name, res.blob));
    const content = await zip.generateAsync({ type: "blob" });
    downloadFile(content, `converted_pdf_images.zip`);
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {!pdfjs && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-primary">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span className="text-xs font-bold uppercase tracking-widest">Loading PDF Engine...</span>
        </div>
      )}

      <UploadPanel
        files={files}
        onChange={setFiles}
        accept={{ 'application/pdf': ['.pdf'] }}
        maxFiles={5}
      />

      {files.length > 0 && results.length === 0 && (
        <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6 animate-in fade-in duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/30 rounded-xl border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground">
                     <Settings2 className="w-3 h-3" /> Image Quality
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground">
                     <ImageIcon className="w-3 h-3" /> Resolution (DPI)
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{dpi} DPI</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                   {[72, 150, 300].map(d => (
                     <button
                        key={d}
                        onClick={() => setDpi(d)}
                        className={`py-2 rounded-lg text-xs font-black transition-all ${dpi === d ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted'}`}
                     >
                       {d}
                     </button>
                   ))}
                </div>
              </div>
           </div>

           <button
              onClick={handleConvert}
              disabled={isProcessing || !pdfjs}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
           >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Converting... {progress}%
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  Convert PDF to {extension.toUpperCase()}
                </>
              )}
           </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.slice(0, 10).map((res, i) => (
                <div key={i} className="card border rounded-xl overflow-hidden bg-card shadow-sm group relative">
                   <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                      <img src={res.url} alt={res.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="p-2 bg-background/80 backdrop-blur-sm absolute bottom-0 left-0 right-0 border-t border-border/50">
                      <p className="text-[9px] font-black truncate text-center uppercase tracking-tighter">{res.name}</p>
                   </div>
                </div>
              ))}
              {results.length > 10 && (
                <div className="card border rounded-xl border-dashed flex flex-col items-center justify-center text-muted-foreground gap-1 bg-muted/10">
                   <span className="text-xl font-black">+{results.length - 10}</span>
                   <span className="text-[10px] font-bold uppercase">More Pages</span>
                </div>
              )}
           </div>

           <div className="flex gap-3">
              <button
                onClick={handleDownloadZip}
                className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download All as ZIP
              </button>
              <button
                onClick={() => { setFiles([]); setResults([]); }}
                className="px-6 py-4 rounded-xl border border-border font-bold text-sm hover:bg-muted/50"
              >
                Reset
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
