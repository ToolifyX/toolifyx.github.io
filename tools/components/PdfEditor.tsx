"use client";

import React, { useState, useEffect } from 'react';
import Toolbar from '@/components/Toolbar';
import Sidebar from '@/components/Sidebar';
import ThumbnailStrip from '@/components/ThumbnailStrip';
import PdfCanvas from '@/components/PdfCanvas';
import { Annotation, exportPdf } from '@/lib/pdfEngine';
import { Loader2, Upload } from 'lucide-react';
import { downloadFile } from '@/lib/utils';

// PDFJS will be loaded from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function PdfEditor() {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [originalBuffer, setOriginalBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.5);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedTool, setSelectedTool] = useState('text');
  const [isLoaded, setIsLoaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load PDF.js from CDN
  useEffect(() => {
    if (window.pdfjsLib) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setIsLoaded(true);
    };
    document.head.appendChild(script);
    return () => {
      // Don't remove script to keep it available if navigating back
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !window.pdfjsLib) return;

    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    setOriginalBuffer(buffer);

    const loadingTask = window.pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    setPdfDoc(pdf);
    setPageCount(pdf.numPages);
    setCurrentPage(1);
  };

  const addAnnotation = (ann: Partial<Annotation>) => {
    const newAnn: Annotation = {
      id: Math.random().toString(36).substring(2, 9),
      page: ann.page || 0,
      type: ann.type || 'text',
      x: ann.x || 0,
      y: ann.y || 0,
      width: ann.width,
      height: ann.height,
      content: ann.content,
      color: ann.color,
      points: ann.points
    };
    setAnnotations(prev => [...prev, newAnn]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const handleExport = async () => {
    if (!originalBuffer) return;
    setIsProcessing(true);
    try {
      const result = await exportPdf(originalBuffer, annotations);
      const blob = new Blob([result as any], { type: 'application/pdf' });
      downloadFile(blob, `edited_${fileName || 'document.pdf'}`);
    } catch (err) {
      console.error(err);
      alert('Export failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loading PDF Engine...</p>
      </div>
    );
  }

  if (!pdfDoc) {
    return (
      <div className="p-12">
        <div
          className="border-2 border-dashed border-border rounded-3xl p-20 flex flex-col items-center justify-center gap-6 group hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer"
          onClick={() => document.getElementById('pdf-editor-upload')?.click()}
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
            <Upload className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black uppercase tracking-wider">Open PDF to Start Editing</h2>
            <p className="text-sm text-muted-foreground font-medium">Full browser-based editing. Private & Secure.</p>
          </div>
          <input
            id="pdf-editor-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[800px] bg-background relative overflow-hidden">
      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-8 rounded-3xl shadow-2xl border flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-black uppercase tracking-widest">Generating PDF...</p>
          </div>
        </div>
      )}

      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onUndo={() => {}}
        onRedo={() => {}}
        onExport={handleExport}
        onDeleteSelected={() => {}}
        canUndo={false}
        canRedo={false}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 overflow-y-auto bg-muted/20 p-8 custom-scrollbar relative">
          <div className="max-w-4xl mx-auto group">
             {Array.from({ length: pageCount }).map((_, i) => (
                <div key={i} id={`page-${i + 1}`}>
                  <PdfCanvas
                    pageNumber={i + 1}
                    pdfDoc={pdfDoc}
                    zoom={zoom}
                    annotations={annotations}
                    onAddAnnotation={addAnnotation}
                    selectedTool={selectedTool}
                  />
                </div>
             ))}
          </div>

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-md border rounded-full px-4 py-2 shadow-2xl z-40">
             <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-muted rounded-full text-xs font-bold">-</button>
             <span className="text-[10px] font-black uppercase tracking-widest w-12 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-muted rounded-full text-xs font-bold">+</button>
          </div>
        </div>

        <Sidebar
          annotations={annotations}
          pageCount={pageCount}
          fileName={fileName}
          onRemoveAnnotation={removeAnnotation}
        />
      </div>

      <ThumbnailStrip
        pageCount={pageCount}
        currentPage={currentPage}
        onPageSelect={(p) => {
          setCurrentPage(p);
          document.getElementById(`page-${p}`)?.scrollIntoView({ behavior: 'smooth' });
        }}
        pdfDoc={pdfDoc}
      />
    </div>
  );
}
