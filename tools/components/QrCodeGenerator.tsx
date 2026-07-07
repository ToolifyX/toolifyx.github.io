"use client";

/**
 * SEO Title: QR Code Generator - Create Custom QR Codes Online
 * Meta Description: Generate highly customizable QR codes for URLs, WiFi, Emails, and more. Customize colors, size, and error correction. Export as PNG, SVG, or JPG.
 */

import React, { useState, useEffect } from 'react';
// @ts-ignore
import QRCode from 'qrcode';
import { Download, Zap, Settings2, Share2, Palette, Globe, Mail, Phone, MessageSquare, Wifi, MapPin } from 'lucide-react';
import { downloadFile } from '@/lib/utils';

type QrType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi';

export default function QrCodeGenerator() {
  const [type, setType] = useState<QrType>('url');
  const [text, setText] = useState('https://ssolstice.dev');
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({
    size: 512,
    margin: 2,
    color: '#000000',
    background: '#ffffff',
    errorCorrectionLevel: 'H' as 'L' | 'M' | 'Q' | 'H'
  });
  const [format, setFormat] = useState<'png' | 'svg' | 'jpg'>('png');

  useEffect(() => {
    if (text) {
      const config = {
        width: options.size,
        margin: options.margin,
        color: {
          dark: options.color,
          light: options.background
        },
        errorCorrectionLevel: options.errorCorrectionLevel
      };

      if (format === 'svg') {
        QRCode.toString(text, { ...config, type: 'svg' }, (err: any, svg: string) => {
          if (!err) setUrl('data:image/svg+xml;base64,' + btoa(svg));
        });
      } else {
        QRCode.toDataURL(text, config, (err: any, dataUrl: string) => {
          if (!err) setUrl(dataUrl);
        });
      }
    } else {
      setUrl('');
    }
  }, [text, options, format]);

  const handleDownload = () => {
    if (!url) return;
    if (format === 'svg') {
      const svg = atob(url.split(',')[1]);
      downloadFile(new Blob([svg], { type: 'image/svg+xml' }), 'qrcode.svg');
    } else {
      const byteString = atob(url.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      downloadFile(new Blob([ab], { type: `image/${format === 'jpg' ? 'jpeg' : format}` }), `qrcode.${format}`);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6">
              <div className="flex flex-wrap gap-2">
                 <TypeButton active={type === 'url'} icon={<Globe className="w-3.5 h-3.5" />} label="URL" onClick={() => setType('url')} />
                 <TypeButton active={type === 'text'} icon={<MessageSquare className="w-3.5 h-3.5" />} label="Text" onClick={() => setType('text')} />
                 <TypeButton active={type === 'email'} icon={<Mail className="w-3.5 h-3.5" />} label="Email" onClick={() => setType('email')} />
                 <TypeButton active={type === 'phone'} icon={<Phone className="w-3.5 h-3.5" />} label="Phone" onClick={() => setType('phone')} />
                 <TypeButton active={type === 'wifi'} icon={<Wifi className="w-3.5 h-3.5" />} label="WiFi" onClick={() => setType('wifi')} />
              </div>

              <textarea
                className="w-full border rounded-xl p-4 min-h-[150px] text-lg font-bold bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter content for QR code..."
              />

              {url && (
                <div className="flex flex-col items-center justify-center p-12 bg-muted/10 rounded-3xl border border-dashed border-border/50 group">
                   <div className="p-6 bg-white rounded-2xl shadow-2xl transition-transform group-hover:scale-105 duration-500">
                      <img src={url} alt="QR Code" className="w-48 h-48" />
                   </div>
                   <div className="mt-8 flex gap-3 w-full max-w-sm">
                      <button
                        onClick={handleDownload}
                        className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-lg transition-all"
                      >
                         Download {format.toUpperCase()}
                      </button>
                      <select
                        className="px-4 bg-muted/50 border border-border rounded-xl font-bold text-xs uppercase"
                        value={format}
                        onChange={e => setFormat(e.target.value as any)}
                      >
                         <option value="png">PNG</option>
                         <option value="svg">SVG</option>
                         <option value="jpg">JPG</option>
                      </select>
                   </div>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="card border rounded-xl p-6 bg-card shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                 <Settings2 className="w-4 h-4" /> Customization
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Module Color</label>
                       <span className="text-[10px] font-black uppercase text-primary">{options.color}</span>
                    </div>
                    <div className="flex gap-2">
                       <input type="color" value={options.color} onChange={e => setOptions(prev => ({...prev, color: e.target.value}))} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                       <input type="text" value={options.color} onChange={e => setOptions(prev => ({...prev, color: e.target.value}))} className="flex-1 border rounded-xl px-3 text-xs font-mono font-bold bg-muted/20" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Error Correction</label>
                    <div className="grid grid-cols-4 gap-2">
                       {(['L', 'M', 'Q', 'H'] as const).map(l => (
                         <button
                           key={l}
                           onClick={() => setOptions(prev => ({...prev, errorCorrectionLevel: l}))}
                           className={`py-2 rounded-lg text-xs font-black transition-all ${options.errorCorrectionLevel === l ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}
                         >
                           {l}
                         </button>
                       ))}
                    </div>
                    <p className="text-[9px] text-muted-foreground italic px-1">Higher levels allow more damage but result in a denser QR code.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TypeButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
    >
      {icon}
      {label}
    </button>
  );
}
