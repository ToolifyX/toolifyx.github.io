import { PDFDocument } from 'pdf-lib';

export interface PageRange {
  from: number;
  to: number;
}

function ensurePositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer.`);
  }
}

function toZeroBasedPageIndexes(pages: number[], pageCount: number): number[] {
  const unique = Array.from(new Set(pages)).sort((a, b) => a - b);
  unique.forEach((page) => {
    if (page > pageCount) {
      throw new Error(`Page ${page} exceeds total pages (${pageCount}).`);
    }
  });
  return unique.map((page) => page - 1);
}

export function parsePageInput(input: string): number[] {
  const normalized = input.trim();
  if (!normalized) {
    throw new Error('Please provide pages to extract.');
  }

  const pages: number[] = [];
  const segments = normalized
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    throw new Error('Please provide pages to extract.');
  }

  for (const segment of segments) {
    if (segment.includes('-')) {
      const [fromRaw, toRaw] = segment.split('-').map((part) => part.trim());
      const from = Number(fromRaw);
      const to = Number(toRaw);
      ensurePositiveInteger(from, 'Range start');
      ensurePositiveInteger(to, 'Range end');
      if (from > to) {
        throw new Error(`Invalid range "${segment}". Start cannot be greater than end.`);
      }
      for (let page = from; page <= to; page++) {
        pages.push(page);
      }
      continue;
    }

    const page = Number(segment);
    ensurePositiveInteger(page, 'Page number');
    pages.push(page);
  }

  return Array.from(new Set(pages)).sort((a, b) => a - b);
}

export function validateRanges(ranges: PageRange[]): PageRange[] {
  if (!ranges.length) {
    throw new Error('Please add at least one range.');
  }

  return ranges.map((range, index) => {
    ensurePositiveInteger(range.from, `Range ${index + 1} start`);
    ensurePositiveInteger(range.to, `Range ${index + 1} end`);
    if (range.from > range.to) {
      throw new Error(`Range ${index + 1}: start cannot be greater than end.`);
    }
    return range;
  });
}

export function estimateSplitCount(
  pageCount: number,
  mode: 'range' | 'extract' | 'fixed',
  params: { ranges: PageRange[]; pageInput: string; pagesPerSplit: number; mergeRanges: boolean }
) {
  if (pageCount <= 0) return 0;

  if (mode === 'range') {
    const validated = validateRanges(params.ranges);
    return params.mergeRanges ? 1 : validated.length;
  }

  if (mode === 'extract') {
    return parsePageInput(params.pageInput).length;
  }

  ensurePositiveInteger(params.pagesPerSplit, 'Pages per split');
  return Math.ceil(pageCount / params.pagesPerSplit);
}

async function createPdfFromIndexes(source: PDFDocument, pageIndexes: number[]): Promise<Uint8Array> {
  const next = await PDFDocument.create();
  const copied = await next.copyPages(source, pageIndexes);
  copied.forEach((page) => next.addPage(page));
  return next.save();
}

export async function splitByRanges(
  source: PDFDocument,
  ranges: PageRange[],
  mergeRanges: boolean
): Promise<Uint8Array[]> {
  const validated = validateRanges(ranges);
  const pageCount = source.getPageCount();

  if (mergeRanges) {
    const pages = validated.flatMap((range) => {
      const list: number[] = [];
      for (let page = range.from; page <= range.to; page++) list.push(page);
      return list;
    });
    const indexes = toZeroBasedPageIndexes(pages, pageCount);
    return [await createPdfFromIndexes(source, indexes)];
  }

  const chunks: Uint8Array[] = [];
  for (const range of validated) {
    const pages: number[] = [];
    for (let page = range.from; page <= range.to; page++) pages.push(page);
    const indexes = toZeroBasedPageIndexes(pages, pageCount);
    chunks.push(await createPdfFromIndexes(source, indexes));
  }

  return chunks;
}

export async function splitByPages(source: PDFDocument, pages: number[]): Promise<Uint8Array[]> {
  const pageCount = source.getPageCount();
  const indexes = toZeroBasedPageIndexes(pages, pageCount);
  const chunks: Uint8Array[] = [];

  for (const index of indexes) {
    chunks.push(await createPdfFromIndexes(source, [index]));
  }

  return chunks;
}

export async function splitByFixed(source: PDFDocument, size: number): Promise<Uint8Array[]> {
  ensurePositiveInteger(size, 'Pages per split');
  const pageCount = source.getPageCount();
  const chunks: Uint8Array[] = [];

  for (let start = 0; start < pageCount; start += size) {
    const end = Math.min(start + size, pageCount);
    const indexes = Array.from({ length: end - start }, (_, idx) => start + idx);
    chunks.push(await createPdfFromIndexes(source, indexes));
  }

  return chunks;
}
