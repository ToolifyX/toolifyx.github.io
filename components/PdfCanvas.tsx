"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Annotation } from '@/lib/pdfEngine';

interface PdfCanvasProps {
  pageNumber: number;
  pdfDoc: any; // PDFJS document proxy
  zoom: number;
  annotations: Annotation[];
  onAddAnnotation: (ann: Partial<Annotation>) => void;
  selectedTool: string;
}

export default function PdfCanvas({
  pageNumber,
  pdfDoc,
  zoom,
  annotations,
  onAddAnnotation,
  selectedTool
}: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: zoom });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setPageSize({ width: viewport.width, height: viewport.height });

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, zoom]);

  // Draw annotations on overlay
  useEffect(() => {
    if (!overlayRef.current || pageSize.width === 0) return;

    const canvas = overlayRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations.filter(a => a.page === pageNumber - 1).forEach(ann => {
      ctx.strokeStyle = ann.color || '#000';
      ctx.fillStyle = ann.color || '#000';
      ctx.lineWidth = 2;

      if (ann.type === 'text') {
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(ann.content || '', ann.x * zoom, ann.y * zoom);
      } else if (ann.type === 'highlight') {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = ann.color || '#ffff00';
        ctx.fillRect(ann.x * zoom, ann.y * zoom, (ann.width || 100) * zoom, (ann.height || 20) * zoom);
        ctx.globalAlpha = 1.0;
      } else if (ann.type === 'draw' && ann.points) {
        ctx.beginPath();
        ann.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x * zoom, p.y * zoom);
          else ctx.lineTo(p.x * zoom, p.y * zoom);
        });
        ctx.stroke();
      } else if (ann.type === 'image' && ann.content) {
        const img = new Image();
        img.src = ann.content;
        // Images might load asynchronously, so we might need to re-draw or handle differently
        // For simplicity, we assume they are already in memory if they were just added
        if (img.complete) {
            ctx.drawImage(img, ann.x * zoom, ann.y * zoom, (ann.width || 100) * zoom, (ann.height || 100) * zoom);
        } else {
            img.onload = () => {
                ctx.drawImage(img, ann.x * zoom, ann.y * zoom, (ann.width || 100) * zoom, (ann.height || 100) * zoom);
            };
        }
      }
    });

    // Draw active drawing
    if (isDrawing && currentPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      currentPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * zoom, p.y * zoom);
        else ctx.lineTo(p.x * zoom, p.y * zoom);
      });
      ctx.stroke();
    }
  }, [annotations, pageSize, zoom, isDrawing, currentPoints]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedTool || selectedTool === 'select') return;

    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (selectedTool === 'draw') {
      setIsDrawing(true);
      setCurrentPoints([{ x, y }]);
    } else if (selectedTool === 'text') {
      const content = prompt("Enter text:");
      if (content) {
        onAddAnnotation({
          type: 'text',
          page: pageNumber - 1,
          x,
          y,
          content,
          color: '#000000'
        });
      }
    } else if (selectedTool === 'highlight') {
        onAddAnnotation({
            type: 'highlight',
            page: pageNumber - 1,
            x,
            y: y - 10,
            width: 100,
            height: 20,
            color: '#ffff00'
        });
    } else if (selectedTool === 'image') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (ie: any) => {
          const file = ie.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              onAddAnnotation({
                type: 'image',
                page: pageNumber - 1,
                x,
                y,
                content: re.target?.result as string,
                width: 100,
                height: 100
              });
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setCurrentPoints(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      onAddAnnotation({
        type: 'draw',
        page: pageNumber - 1,
        points: currentPoints,
        color: '#000000'
      });
      setIsDrawing(false);
      setCurrentPoints([]);
    }
  };

  return (
    <div className="relative shadow-xl border border-border mx-auto mb-8 bg-white transition-all duration-200 group">
      <canvas ref={canvasRef} className="block" />
      <canvas
        ref={overlayRef}
        width={pageSize.width}
        height={pageSize.height}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Page {pageNumber}
      </div>
    </div>
  );
}
