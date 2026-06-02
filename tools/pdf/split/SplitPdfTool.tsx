"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { downloadFile } from '@/lib/utils';
import { downloadAllAsZip } from '@/lib/download';
import PDFUploader from '@/components/PDFUploader';
import ResultPanel from '@/components/tool-layout/ResultPanel';
import ResultScreen from '@/components/tool-layout/ResultScreen';
import SplitModeTabs from './SplitModeTabs';
import RangeEditor from './RangeEditor';
import ExtractEditor from './ExtractEditor';
import FixedEditor from './FixedEditor';
import { estimateSplitCount } from './pdfSplitUtils';
import { useSplitPdf } from './useSplitPdf';

export default function SplitPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [firstFilePageCount, setFirstFilePageCount] = useState<number | null>(null);

  const {
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
  } = useSplitPdf(files);

  useEffect(() => {
    let cancelled = false;

    const loadPageCount = async () => {
      if (!files.length) {
        setFirstFilePageCount(null);
        return;
      }

      try {
        const source = await PDFDocument.load(await files[0].arrayBuffer());
        if (!cancelled) setFirstFilePageCount(source.getPageCount());
      } catch {
        if (!cancelled) setFirstFilePageCount(null);
      }
    };

    loadPageCount();
    return () => {
      cancelled = true;
    };
  }, [files]);

  const previewCount = useMemo(() => {
    if (!firstFilePageCount) return 0;
    try {
      return estimateSplitCount(firstFilePageCount, mode, {
        ranges,
        pageInput,
        pagesPerSplit,
        mergeRanges,
      });
    } catch {
      return 0;
    }
  }, [firstFilePageCount, mode, ranges, pageInput, pagesPerSplit, mergeRanges]);

  const handleReset = () => {
    setFiles([]);
    setFirstFilePageCount(null);
    reset();
  };

  if (!isProcessing && results.length > 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <ResultScreen
          results={results}
          onReset={handleReset}
          onDownload={(result) => downloadFile(result.blob, result.name)}
          onDownloadAll={() => downloadAllAsZip(results.map(({ name, blob }) => ({ name, blob })), 'split-pdf-results')}
          title="PDF Split Complete"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="card border rounded-lg p-3 bg-card shadow-sm space-y-4">
        <PDFUploader files={files} onChange={setFiles} />
      </div>

      {files.length > 0 && (
        <div className="card border rounded-lg p-4 bg-card shadow-sm space-y-4">
          <SplitModeTabs mode={mode} onChange={setMode} />

          {mode === 'range' && (
            <RangeEditor
              ranges={ranges}
              mergeRanges={mergeRanges}
              onAddRange={addRange}
              onRemoveRange={removeRange}
              onUpdateRange={updateRange}
              onMergeRangesChange={setMergeRanges}
            />
          )}

          {mode === 'extract' && <ExtractEditor pageInput={pageInput} onChange={setPageInput} />}

          {mode === 'fixed' && <FixedEditor pagesPerSplit={pagesPerSplit} onChange={setPagesPerSplit} />}

          {previewCount > 0 && (
            <p className="text-sm text-muted-foreground font-medium">
              This PDF will be split into approximately {previewCount} file{previewCount > 1 ? 's' : ''}.
            </p>
          )}

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <button
            onClick={splitPdf}
            disabled={isProcessing}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Splitting...
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                Split PDF
              </>
            )}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-2">
          {progress.message && <p className="text-sm text-muted-foreground font-medium">{progress.message}</p>}
          <ResultPanel
            isProcessing={isProcessing}
            results={[]}
            progress={{ current: progress.current, total: progress.total }}
            onDownload={() => {}}
            onDownloadAll={() => {}}
          />
        </div>
      )}
    </div>
  );
}
