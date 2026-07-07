"use client";

/**
 * SEO Title: Google SERP Preview Tool - Online Search Results Previewer
 * Meta Description: See how your website appears in Google search results. Preview meta titles and descriptions for mobile and desktop views instantly.
 */

import React, { useState } from 'react';
import { Globe, Smartphone, Laptop, AlertCircle, RefreshCw } from 'lucide-react';

export default function SerpPreview() {
  const [title, setTitle] = useState('My Awesome Website | ToolifyX');
  const [description, setDescription] = useState('Discover the best free online tools for developers and creators. Fast, secure, and privacy-focused utilities for your daily workflow.');
  const [url, setUrl] = useState('https://toolifyx.github.io/tools/seo');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title Tag</label>
                       <span className={`text-[10px] font-black ${title.length > 60 ? 'text-orange-500' : 'text-primary'}`}>{title.length} / 60</span>
                    </div>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meta Description</label>
                       <span className={`text-[10px] font-black ${description.length > 160 ? 'text-orange-500' : 'text-primary'}`}>{description.length} / 160</span>
                    </div>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-24" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">URL</label>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                 </div>
              </div>

              <button
                onClick={() => { setTitle(''); setDescription(''); setUrl(''); }}
                className="w-full border px-6 py-3 rounded-xl font-bold hover:bg-muted/50 transition-all text-xs uppercase tracking-widest"
              >
                 Reset Preview
              </button>
           </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                   <Globe className="w-3.5 h-3.5" /> Google Search Result
                </span>
                <div className="flex gap-1">
                   <button onClick={() => setDevice('mobile')} className={`p-2 rounded-lg transition-all ${device === 'mobile' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}><Smartphone className="w-4 h-4" /></button>
                   <button onClick={() => setDevice('desktop')} className={`p-2 rounded-lg transition-all ${device === 'desktop' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}><Laptop className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex-1 p-10 flex items-center justify-center bg-muted/5">
                 <div className={`w-full transition-all duration-500 ${device === 'mobile' ? 'max-w-[360px] bg-white border border-border/50 rounded-2xl shadow-xl p-6' : 'max-w-none'}`}>
                    <div className="space-y-1 group cursor-default">
                       <div className="flex items-center gap-2 text-sm text-[#202124] mb-1">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] shrink-0 border border-border/50">G</div>
                          <div className="min-w-0">
                             <div className="text-[12px] leading-tight truncate">ToolifyX</div>
                             <div className="text-[10px] text-[#5f6368] truncate">{url}</div>
                          </div>
                       </div>
                       <h3 className={`text-xl font-medium leading-tight text-[#1a0dab] group-hover:underline ${device === 'mobile' ? 'text-base' : ''}`}>
                          {title || 'Untitled Page'}
                       </h3>
                       <p className={`text-[14px] leading-relaxed text-[#4d5156] break-words ${device === 'mobile' ? 'text-xs' : ''}`}>
                          {description || 'No description provided. Search engines will generate one based on content.'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
