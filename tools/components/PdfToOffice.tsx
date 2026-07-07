"use client";

/**
 * SEO Title: PDF to Word & Excel Converter - Convert PDF to Office Online
 * Meta Description: High-fidelity PDF to Word (.docx) and Excel (.xlsx) converter. Extract text and tables locally in your browser. Fast, free, and secure.
 */

import React, { useState, useEffect } from 'react';
import { Download, Loader2, Zap, FileText, Table, AlertCircle } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile } from '@/lib/utils';
import { Tool } from '@/tools/types';

interface Props {
  tool: Tool;
}

export default function PdfToOffice({ tool }: Props) {
  const isExcel = tool.slug === 'pdf-to-excel';
  const extension = isExcel ? 'xlsx' : 'docx';

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [officeLib, setOfficeLib] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load PDF.js
      const pdfScript = document.createElement('script');
      pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      pdfScript.async = true;
      pdfScript.onload = () => {
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjs(pdfjsLib);
      };
      document.body.appendChild(pdfScript);

      // Load Office Lib (docx or xlsx)
      const officeScript = document.createElement('script');
      officeScript.src = isExcel
        ? 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js'
        : 'https://unpkg.com/docx@8.5.0/build/index.js';
      officeScript.async = true;
      officeScript.onload = () => {
        setOfficeLib(() => isExcel ? (window as any).XLSX : (window as any).docx);
      };
      document.body.appendChild(officeScript);
    }
  }, [isExcel]);

  const convertPdf = async (file: File) => {
    if (!pdfjs || !officeLib) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    if (isExcel) {
      // Basic Excel: Extract each page as a sheet or combined rows
      const allRows: string[][] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // Very basic table heuristic: group by Y coordinate
        const rows: Record<string, string[]> = {};
        content.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          if (!rows[y]) rows[y] = [];
          rows[y].push(item.str);
        });
        Object.values(rows).forEach(row => allRows.push(row));
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const ws = officeLib.utils.aoa_to_sheet(allRows);
      const wb = officeLib.utils.book_new();
      officeLib.utils.book_append_sheet(wb, ws, "ExtractedData");
      const out = officeLib.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else {
      // Basic Word: Extract text and preserve blocks
      const sections = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item: any) => item.str).join(' ');

        sections.push({
          properties: {},
          children: [
            new officeLib.Paragraph({
              children: [new officeLib.TextRun(text)],
            }),
          ],
        });
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const doc = new officeLib.Document({ sections });
      const blob = await officeLib.Packer.toBlob(doc);
      return blob;
    }
  };

  const handleProcess = async () => {
    if (files.length === 0 || !pdfjs || !officeLib) return;
    setIsProcessing(true);
    try {
      const resultBlob = await convertPdf(files[0]);
      if (resultBlob) {
        downloadFile(resultBlob, `${files[0].name.replace(/\.pdf$/i, '')}.${extension}`);
      }
    } catch (err) {
      console.error(err);
      alert("Conversion failed. Try a simpler PDF.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      {(!pdfjs || !officeLib) && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3 text-blue-600">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span className="text-xs font-bold uppercase tracking-widest">Loading Office Engine...</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        <UploadPanel files={files} onChange={setFiles} maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

        {files.length > 0 && !isProcessing && (
          <div className="card border rounded-2xl p-8 bg-card shadow-sm space-y-6 animate-in zoom-in-95 duration-500">
             <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-4 rounded-full bg-primary/10 text-primary`}>
                   {isExcel ? <Table className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">Convert to {extension.toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">Ready to extract {isExcel ? 'table data' : 'text content'} from "{files[0].name}"</p>
             </div>

             <button
                onClick={handleProcess}
                disabled={!pdfjs || !officeLib}
                className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
             >
                <Zap className="w-4 h-4 fill-current" />
                Start Conversion
             </button>
          </div>
        )}

        {isProcessing && (
           <div className="card border rounded-2xl p-12 bg-card flex flex-col items-center justify-center space-y-4 shadow-sm animate-in fade-in duration-300">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="text-center space-y-1">
                 <p className="text-base font-black uppercase tracking-widest">Converting PDF...</p>
                 <p className="text-xs font-bold text-muted-foreground">{progress}% complete</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden max-w-xs border">
                 <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
           </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-700 dark:text-amber-400">
         <AlertCircle className="w-5 h-5 shrink-0" />
         <div className="text-xs font-medium leading-relaxed">
            <p className="font-bold uppercase tracking-widest mb-1">Experimental Feature</p>
            Client-side conversion preserves text and basic structure, but complex layouts, images, and advanced table formatting might vary in the output {extension.toUpperCase()} file.
         </div>
      </div>
    </div>
  );
}
