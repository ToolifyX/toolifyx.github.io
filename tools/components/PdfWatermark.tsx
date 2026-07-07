"use client";

/**
 * SEO Title: Online PDF Watermark - Add Text or Image to PDF
 * Meta Description: Add custom watermarks to your PDF documents. Support for text watermarks, transparency, rotation, and batch processing. Protect your PDFs instantly.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, Settings2, FileSignature, Type, Image as ImageIcon } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile } from '@/lib/utils';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export default function PdfWatermark() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);

  const applyWatermark = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: width / 10,
        font: helveticaBold,
        color: rgb(0.5, 0.5, 0.5),
        opacity: opacity,
        rotate: degrees(rotation),
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const resultBlob = await applyWatermark(files[0]);
      downloadFile(resultBlob, `watermarked_${files[0].name}`);
    } catch (err) {
      console.error(err);
      alert("Failed to apply watermark.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <UploadPanel files={files} onChange={setFiles} maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

           <div className="card border-2 border-dashed rounded-2xl h-[400px] flex items-center justify-center text-muted-foreground italic bg-muted/10 relative overflow-hidden">
              {files.length > 0 ? (
                <div className="text-center animate-in zoom-in-95 duration-500 z-10 p-10 bg-background shadow-2xl rounded-2xl border">
                   <FileSignature className="w-12 h-12 text-primary mx-auto mb-4" />
                   <p className="font-bold text-foreground">{files[0].name}</p>
                   <p className="text-xs">Watermark will be applied to all pages</p>
                </div>
              ) : (
                "Upload a PDF to see preview placeholder"
              )}

              {files.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none" style={{ transform: `rotate(${-rotation}deg)` }}>
                   <span className="text-8xl font-black uppercase" style={{ opacity }}>{text}</span>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
               <Settings2 className="w-4 h-4" /> Watermark Config
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Watermark Text</label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Opacity</label>
                   <span className="text-[10px] font-black text-primary">{(opacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rotation</label>
                   <span className="text-[10px] font-black text-primary">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              Apply Watermark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
