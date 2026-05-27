"use client";

/**
 * SEO Title: Image to PDF - Convert JPG/PNG to PDF Online
 * Meta Description: Easily convert your images into a PDF document. High quality and secure conversion.
 *
 * FAQ 1: Can I convert multiple images?
 * Yes, you can upload multiple images to create a multi-page PDF.
 *
 * FAQ 2: Which image formats are supported?
 * We support JPG and PNG formats.
 *
 * FAQ 3: Is there a file size limit?
 * There is no strict limit, but very large images may take longer to process.
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const convertToPdf = async () => {
    if (files.length === 0) return;
    setLoading(true);
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
      downloadFile(new Blob([pdfBytes], { type: 'application/pdf' }), 'images.pdf');
    } catch (err) {
      console.error(err);
      alert('Error converting images to PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept="image/jpeg,image/png" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="w-full border rounded p-2" />

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm font-medium">Selected Images ({files.length}):</div>
            <ul className="text-xs space-y-1 bg-gray-50 p-2 rounded border">
              {files.map((f, i) => <li key={i}>{f.name}</li>)}
            </ul>
            <button
              onClick={convertToPdf}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              {loading ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
