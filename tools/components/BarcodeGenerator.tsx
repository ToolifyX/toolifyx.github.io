"use client";

/**
 * SEO Title: Barcode Generator - Create Custom Barcodes Online
 * Meta Description: Generate professional barcodes in various formats (Code128, EAN, UPC, ITF). Customize width, height, and colors. Free and secure client-side generation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Download, Zap, Settings2, Barcode as BarcodeIcon, Palette, Copy } from 'lucide-react';
import { downloadFile } from '@/lib/utils';

const FORMATS = [
  'CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14', 'MSI', 'pharmacode'
];

export default function BarcodeGenerator() {
  const [value, setValue] = useState('12345678');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [jsBarcode, setJsBarcode] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Load JsBarcode from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      setJsBarcode(() => window.JsBarcode);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (jsBarcode && svgRef.current) {
      try {
        jsBarcode(svgRef.current, value, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          background: "transparent",
          lineColor: "currentColor",
          marginTop: 10,
          marginBottom: 10,
        });
      } catch (err) {
        // Silently fail if format doesn't match value
      }
    }
  }, [jsBarcode, value, format, width, height, displayValue]);

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    downloadFile(blob, `barcode-${format}.svg`);
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <div className="card border rounded-2xl p-8 bg-card shadow-sm flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                 <BarcodeIcon className="w-3 h-3" /> Live Preview
              </div>
              <div className="max-w-full overflow-x-auto p-10 bg-white dark:bg-zinc-900 rounded-2xl border border-border/50 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                 <svg ref={svgRef} className="max-w-full text-foreground" />
              </div>
           </div>

           <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download SVG
              </button>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
               <Settings2 className="w-4 h-4" /> Barcode Config
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter text/number..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Format</label>
                <select
                  className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm"
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                >
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Width</label>
                      <span className="text-[9px] font-black text-primary">{width}</span>
                   </div>
                   <input type="range" min="1" max="4" step="1" value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Height</label>
                      <span className="text-[9px] font-black text-primary">{height}px</span>
                   </div>
                   <input type="range" min="20" max="200" step="10" value={height} onChange={e => setHeight(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group bg-muted/20 p-3 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                 <input type="checkbox" checked={displayValue} onChange={e => setDisplayValue(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
                 <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Show Text below</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
