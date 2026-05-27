"use client";

/**
 * SEO Title: PDF Split - Split PDF Pages into Separate Files
 * Meta Description: Extract pages from your PDF or split a large PDF into individual pages.
 *
 * FAQ 1: Can I extract a specific page?
 * Yes, you can enter the page number you want to extract.
 *
 * FAQ 2: Does it support password protected PDFs?
 * Currently, we only support unencrypted PDF files.
 *
 * FAQ 3: How long does it take?
 * Processing is nearly instant as it happens locally in your browser.
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';

export default function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const splitPdf = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      if (pageNumber < 1 || pageNumber > pageCount) {
        alert(`Please enter a page number between 1 and ${pageCount}`);
        return;
      }

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      downloadFile(new Blob([pdfBytes], { type: 'application/pdf' }), `page_${pageNumber}_of_${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Error splitting PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border rounded p-2" />

        {file && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Number to Extract</label>
              <input
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <button
              onClick={splitPdf}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              {loading ? 'Processing...' : 'Extract Page'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
