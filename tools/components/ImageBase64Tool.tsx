"use client";

/**
 * SEO Title: Batch Image to Base64 - Multiple Image Encoder
 * Meta Description: Convert multiple images to Base64 strings or decode strings back to images. Free, secure batch processing tool.
 *
 * FAQ 1: Can I convert multiple images to Base64?
 * Yes, you can upload up to 5 images and get individual Base64 strings for each.
 *
 * FAQ 2: What is the total size limit?
 * You can process up to 20MB of images in a single batch.
 *
 * FAQ 3: How do I use the generated strings?
 * You can copy each Base64 string and paste it directly into your HTML <img> src attribute or CSS background-image.
 */

import React, { useState } from 'react';
import { copyToClipboard, downloadFile, fileToBase64 } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import { Download, Copy, CheckCircle2, Loader2 } from 'lucide-react';

interface Base64Result {
  name: string;
  string: string;
  type: string;
}

export default function ImageBase64Tool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Base64Result[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    const newResults: Base64Result[] = [];
    for (const file of files) {
      const base64 = await fileToBase64(file);
      newResults.push({
        name: file.name,
        string: base64,
        type: file.type
      });
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleDownloadResult = (res: Base64Result) => {
    const parts = res.string.split(',');
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    downloadFile(new Blob([u8arr], { type: res.type }), res.name);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="card border rounded-lg p-4 space-y-6">
        <ImageUploader
          maxFiles={5}
          maxSizeMB={5}
          totalSizeMB={20}
          onChange={setFiles}
        />

        {files.length > 0 && (
          <button
            onClick={handleProcessAll}
            disabled={isProcessing}
            className="bg-black text-white px-4 py-2.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Encoding {files.length} Images...
              </>
            ) : (
              `Encode All ${files.length} Images to Base64`
            )}
          </button>
        )}

        {results.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Encoded Results</h3>
            <div className="grid gap-4">
              {results.map((res, i) => (
                <div key={i} className="p-3 bg-muted/30 border rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate pr-4">{res.name}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopy(res.string, i)}
                        className="p-1.5 rounded-lg bg-card border hover:bg-muted text-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === i ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        {copiedIndex === i ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDownloadResult(res)}
                        className="p-1.5 rounded-lg bg-card border hover:bg-muted text-xs flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    readOnly
                    className="w-full h-20 border rounded-lg p-2 text-[10px] font-mono bg-card"
                    value={res.string}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
