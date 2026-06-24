import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface Annotation {
  id: string;
  page: number;
  type: "text" | "highlight" | "draw" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color?: string;
  points?: { x: number; y: number }[]; // For free draw
}

export async function loadPdf(arrayBuffer: ArrayBuffer) {
  return await PDFDocument.load(arrayBuffer);
}

export async function exportPdf(
  originalBuffer: ArrayBuffer,
  annotations: Annotation[],
  pageOperations?: { type: 'delete' | 'duplicate' | 'move', pageIndex: number, targetIndex?: number }[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalBuffer);

  // Apply page operations first
  if (pageOperations) {
    for (const op of pageOperations) {
      if (op.type === 'delete') {
        pdfDoc.removePage(op.pageIndex);
      } else if (op.type === 'duplicate') {
        const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [op.pageIndex]);
        pdfDoc.insertPage(op.pageIndex + 1, copiedPage);
      }
    }
  }

  const pages = pdfDoc.getPages();

  for (const ann of annotations) {
    if (ann.page >= pages.length) continue;
    const page = pages[ann.page];
    const { width, height } = page.getSize();

    // Convert from normalized or canvas coordinates to PDF coordinates
    // PDF coordinates start from bottom-left (0,0)

    if (ann.type === 'text' && ann.content) {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(ann.content, {
        x: ann.x,
        y: height - ann.y, // Simple flip for now, might need more precise calc
        size: 12,
        font,
        color: hexToRgb(ann.color || '#000000'),
      });
    } else if (ann.type === 'highlight') {
      page.drawRectangle({
        x: ann.x,
        y: height - ann.y - (ann.height || 20),
        width: ann.width || 100,
        height: ann.height || 20,
        color: hexToRgb(ann.color || '#ffff00'),
        opacity: 0.4,
      });
    } else if (ann.type === 'draw' && ann.points && ann.points.length > 1) {
       // Drawing lines for free draw
       for(let i = 0; i < ann.points.length - 1; i++) {
         const p1 = ann.points[i];
         const p2 = ann.points[i+1];
         page.drawLine({
           start: { x: p1.x, y: height - p1.y },
           end: { x: p2.x, y: height - p2.y },
           thickness: 2,
           color: hexToRgb(ann.color || '#000000'),
         });
       }
    } else if (ann.type === 'image' && ann.content) {
       try {
         const imageBytes = await fetch(ann.content).then((res) => res.arrayBuffer());
         let embeddedImage;
         if (ann.content.includes('image/png')) {
           embeddedImage = await pdfDoc.embedPng(imageBytes);
         } else {
           embeddedImage = await pdfDoc.embedJpg(imageBytes);
         }
         page.drawImage(embeddedImage, {
           x: ann.x,
           y: height - ann.y - (ann.height || 100),
           width: ann.width || 100,
           height: ann.height || 100,
         });
       } catch (e) {
         console.error("Failed to embed image", e);
       }
    }
  }

  return await pdfDoc.save();
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
}
