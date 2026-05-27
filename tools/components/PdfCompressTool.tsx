"use client";

/**
 * SEO Title: PDF Compressor - Reduce PDF File Size Online
 * Meta Description: Compress your PDF files to make them smaller for email or web upload.
 *
 * FAQ 1: How much can it compress?
 * The reduction depends on the original PDF. Some files can be reduced by 50% or more.
 *
 * FAQ 2: Does it reduce image quality?
 * This basic version optimizes the PDF structure. High-level image downsampling is not included.
 *
 * FAQ 3: Is it secure?
 * Yes, all processing is done in your browser.
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';

export default function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ original: 0, compressed: 0 });

  const compressPdf = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      // pdf-lib's save method can use object stream compression which often reduces size
      const pdfBytes = await pdf.save({ useObjectStreams: true });

      setStats({
        original: file.size,
        compressed: pdfBytes.length
      });

      downloadFile(new Blob([pdfBytes], { type: 'application/pdf' }), `compressed_${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF');
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
            {stats.compressed > 0 && (
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className="p-2 bg-gray-50 rounded">Original: {(stats.original / 1024).toFixed(2)} KB</div>
                <div className="p-2 bg-green-50 rounded font-bold">Compressed: {(stats.compressed / 1024).toFixed(2)} KB</div>
              </div>
            )}
            <button
              onClick={compressPdf}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              {loading ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
