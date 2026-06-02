import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ProcessedResult } from '@/lib/imagePipeline';
import { PageRange, parsePageInput, splitByFixed, splitByPages, splitByRanges, validateRanges } from './pdfSplitUtils';
import { SplitMode } from './SplitModeTabs';

interface SplitProgress {
  current: number;
  total: number;
  message: string;
}

function buildResultName(fileName: string, index: number, total: number) {
  const baseName = fileName.replace(/\.pdf$/i, '');
  return `${baseName}_split_${index + 1}${total > 1 ? '' : ''}.pdf`;
}

export function useSplitPdf(files: File[]) {
  const [mode, setMode] = useState<SplitMode>('range');
  const [ranges, setRanges] = useState<PageRange[]>([{ from: 1, to: 3 }]);
  const [mergeRanges, setMergeRanges] = useState(false);
  const [pageInput, setPageInput] = useState('1,3,5-8');
  const [pagesPerSplit, setPagesPerSplit] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [progress, setProgress] = useState<SplitProgress>({ current: 0, total: 0, message: '' });
  const [error, setError] = useState<string | null>(null);

  const addRange = () => setRanges((prev) => [...prev, { from: 1, to: 1 }]);
  const removeRange = (index: number) => setRanges((prev) => prev.filter((_, idx) => idx !== index));
  const updateRange = (index: number, field: 'from' | 'to', value: number) => {
    setRanges((prev) =>
      prev.map((range, idx) => (idx === index ? { ...range, [field]: Math.max(1, value || 1) } : range))
    );
  };

  const validateInput = () => {
    if (!files.length) throw new Error('Please upload at least one PDF file.');

    if (mode === 'range') {
      validateRanges(ranges);
      return;
    }
    if (mode === 'extract') {
      parsePageInput(pageInput);
      return;
    }
    if (!Number.isInteger(pagesPerSplit) || pagesPerSplit <= 0) {
      throw new Error('Pages per split must be a positive integer.');
    }
  };

  const splitPdf = async () => {
    setError(null);
    setResults([]);

    try {
      validateInput();
      setIsProcessing(true);
      setProgress({ current: 0, total: files.length, message: '' });

      const nextResults: ProcessedResult[] = [];

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        setProgress({
          current: fileIndex + 1,
          total: files.length,
          message: `Processing ${fileIndex + 1} of ${files.length} files...`,
        });

        const source = await PDFDocument.load(await file.arrayBuffer());
        let chunks: Uint8Array[] = [];

        if (mode === 'range') {
          chunks = await splitByRanges(source, ranges, mergeRanges);
        } else if (mode === 'extract') {
          chunks = await splitByPages(source, parsePageInput(pageInput));
        } else {
          chunks = await splitByFixed(source, pagesPerSplit);
        }

        for (let splitIndex = 0; splitIndex < chunks.length; splitIndex++) {
          const blob = new Blob([chunks[splitIndex] as BlobPart], { type: 'application/pdf' });
          nextResults.push({
            blob,
            url: URL.createObjectURL(blob),
            name: buildResultName(file.name, splitIndex, chunks.length),
            originalSize: file.size,
            compressedSize: blob.size,
            width: 0,
            height: 0,
          });
        }
      }

      setResults(nextResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to split PDF.';
      setError(message);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, message: '' });
    }
  };

  const reset = () => {
    results.forEach((result) => URL.revokeObjectURL(result.url));
    setResults([]);
    setError(null);
    setIsProcessing(false);
    setProgress({ current: 0, total: 0, message: '' });
  };

  return {
    mode,
    setMode,
    ranges,
    mergeRanges,
    pageInput,
    pagesPerSplit,
    isProcessing,
    results,
    progress,
    error,
    setMergeRanges,
    setPageInput,
    setPagesPerSplit,
    addRange,
    removeRange,
    updateRange,
    splitPdf,
    reset,
  };
}
