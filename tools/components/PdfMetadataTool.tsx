"use client";

/**
 * SEO Title: PDF Metadata Viewer & Page Counter - Inspect PDF Files
 * Meta Description: View PDF metadata including title, author, creator, and total page count.
 *
 * FAQ 1: What information is available?
 * You can see the document title, author, producer, and the total number of pages.
 *
 * FAQ 2: Can I edit the metadata?
 * This version is for viewing only. Editing features are coming soon!
 *
 * FAQ 3: Is it safe?
 * Yes, the PDF is processed in your browser. No data is sent to our servers.
 */

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMetadataTool() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<{ pages: number, title?: string, author?: string, producer?: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      try {
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setInfo({
          pages: pdf.getPageCount(),
          title: pdf.getTitle() || 'N/A',
          author: pdf.getAuthor() || 'N/A',
          producer: pdf.getProducer() || 'N/A'
        });
      } catch (err) {
        console.error(err);
        setInfo(null);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-4">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full border rounded p-2" />

        {info && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded border text-center">
                <div className="text-3xl font-bold">{info.pages}</div>
                <div className="text-xs text-muted-foreground uppercase">Pages</div>
              </div>
              <div className="p-4 bg-muted rounded border text-center flex items-center justify-center">
                <span className="text-xs font-mono truncate">{file?.name}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border text-sm font-mono space-y-1">
              <p><strong>Title:</strong> {info.title}</p>
              <p><strong>Author:</strong> {info.author}</p>
              <p><strong>Producer:</strong> {info.producer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
