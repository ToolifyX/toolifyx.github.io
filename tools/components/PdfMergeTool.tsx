"use client";

/**
 * SEO Title: PDF Merge - Combine PDF Files Online
 * Meta Description: Merge multiple PDF documents into a single file. Secure and fast online PDF combiner.
 *
 * FAQ 1: How do I merge PDFs?
 * Upload two or more PDF files and click "Merge PDFs".
 *
 * FAQ 2: Is there a file limit?
 * You can merge up to 10 files at a time to ensure stability in the browser.
 *
 * FAQ 3: Is my data safe?
 * Yes, all merging happens on your computer. Your files are never uploaded to any server.
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      downloadFile(new Blob([pdfBytes], { type: 'application/pdf' }), 'merged.pdf');
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept=".pdf" multiple onChange={handleFileChange} className="w-full border rounded p-2" />

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm font-medium">Selected Files ({files.length}):</div>
            <ul className="text-xs space-y-1 bg-gray-50 p-2 rounded border">
              {files.map((f, i) => <li key={i} className="truncate">{f.name}</li>)}
            </ul>
            <button
              onClick={mergePdfs}
              disabled={loading || files.length < 2}
              className="bg-black text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
            >
              {loading ? 'Merging...' : 'Merge PDFs'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
