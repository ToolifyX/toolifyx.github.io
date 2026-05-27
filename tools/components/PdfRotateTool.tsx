"use client";

/**
 * SEO Title: PDF Rotate - Rotate PDF Pages Permanently
 * Meta Description: Rotate all pages in your PDF document by 90, 180, or 270 degrees.
 *
 * FAQ 1: How do I rotate a PDF?
 * Upload your file, select the rotation angle, and click "Rotate & Download".
 *
 * FAQ 2: Does it rotate all pages?
 * Yes, currently this tool rotates all pages in the document equally.
 *
 * FAQ 3: Is the quality preserved?
 * Yes, the PDF content itself is not re-rendered, only the page orientation is changed.
 */

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';

export default function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [loading, setLoading] = useState(false);

  const rotatePdf = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + rotation));
      });

      const pdfBytes = await pdf.save();
      downloadFile(new Blob([pdfBytes], { type: 'application/pdf' }), `rotated_${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Error rotating PDF');
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
            <select
              className="w-full border rounded p-2"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
            >
              <option value="90">Rotate 90° Right</option>
              <option value="180">Rotate 180°</option>
              <option value="270">Rotate 90° Left</option>
            </select>
            <button
              onClick={rotatePdf}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              {loading ? 'Processing...' : 'Rotate & Download'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
