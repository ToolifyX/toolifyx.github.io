"use client";

/**
 * SEO Title: Open Graph Preview - Social Media Sharing Tester
 * Meta Description: Preview how your website looks when shared on Facebook, LinkedIn, Discord, and Slack. Optimize your social media tags instantly.
 */

import React, { useState } from 'react';
import { Share2, Globe, Facebook, MessageSquare, AlertCircle } from 'lucide-react';

export default function OgPreview() {
  const [data, setData] = useState({
    title: 'ToolifyX - Every tool for everyone',
    description: 'Fast, private, browser-native tools for developers and creators. Over 50+ utilities including SEO, Text, Image, and PDF tools.',
    url: 'https://toolifyx.github.io',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    siteName: 'ToolifyX'
  });

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sky-500">
                 <Share2 className="w-4 h-4" /> Social Tag Data
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">OG:Title</label>
                    <input type="text" value={data.title} onChange={e => setData(prev => ({...prev, title: e.target.value}))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">OG:Description</label>
                    <textarea value={data.description} onChange={e => setData(prev => ({...prev, description: e.target.value}))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-24" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">OG:URL</label>
                    <input type="text" value={data.url} onChange={e => setData(prev => ({...prev, url: e.target.value}))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">OG:Image URL</label>
                    <input type="text" value={data.image} onChange={e => setData(prev => ({...prev, image: e.target.value}))} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
           <div className="card border rounded-2xl bg-card shadow-sm h-full flex flex-col p-8 space-y-8 bg-muted/5">
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
                    <Facebook className="w-3.5 h-3.5" /> Facebook / LinkedIn Preview
                 </div>
                 <div className="border rounded-xl bg-white overflow-hidden shadow-xl max-w-[500px] mx-auto group cursor-default">
                    <div className="aspect-[1.91/1] bg-muted relative overflow-hidden">
                       <img src={data.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4 bg-[#f2f3f5] border-t">
                       <div className="text-[11px] text-[#606770] uppercase font-bold tracking-tight truncate">{new URL(data.url).hostname || data.siteName}</div>
                       <h3 className="text-base font-black text-[#1d2129] leading-tight mt-1 truncate">{data.title}</h3>
                       <p className="text-sm text-[#606770] leading-snug mt-1 line-clamp-2">{data.description}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border/50">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Discord / Slack Preview
                 </div>
                 <div className="border-l-4 border-[#202225] bg-[#2f3136] p-4 rounded-r-lg shadow-lg max-w-[500px] mx-auto space-y-2">
                    <div className="text-[11px] font-bold text-[#b9bbbe]">{data.siteName}</div>
                    <h3 className="text-sm font-black text-[#00aff4] hover:underline cursor-pointer">{data.title}</h3>
                    <p className="text-xs text-[#dcddde] leading-relaxed">{data.description}</p>
                    <div className="aspect-[1.91/1] w-full max-w-[400px] bg-[#202225] rounded-lg mt-3 overflow-hidden border border-white/5">
                       <img src={data.image} alt="Discord" className="w-full h-full object-cover" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
