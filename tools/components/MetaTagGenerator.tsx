"use client";

/**
 * SEO Title: Meta Tag Generator - Create HTML Metadata for SEO
 * Meta Description: Generate essential HTML meta tags for SEO, Google, Open Graph (Facebook), and Twitter Cards. Fast, free, and secure online generator.
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { Tags, Copy, Download, RefreshCw, Share2, Twitter, Facebook } from 'lucide-react';

export default function MetaTagGenerator() {
  const [meta, setMeta] = useState({
    title: 'Site Title',
    description: 'Site description goes here. Keep it between 150-160 characters for best results.',
    keywords: 'seo, tools, generator',
    author: 'Author Name',
    robots: 'index, follow',
    ogType: 'website',
    ogUrl: 'https://example.com',
    ogImage: 'https://example.com/image.jpg',
    twitterCard: 'summary_large_image',
  });

  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = `<!-- Primary Meta Tags -->\n<title>${meta.title}</title>\n`;
    result += `<meta name="title" content="${meta.title}">\n`;
    result += `<meta name="description" content="${meta.description}">\n`;
    if (meta.keywords) result += `<meta name="keywords" content="${meta.keywords}">\n`;
    if (meta.author) result += `<meta name="author" content="${meta.author}">\n`;
    result += `<meta name="robots" content="${meta.robots}">\n\n`;

    result += `<!-- Open Graph / Facebook -->\n`;
    result += `<meta property="og:type" content="${meta.ogType}">\n`;
    result += `<meta property="og:url" content="${meta.ogUrl}">\n`;
    result += `<meta property="og:title" content="${meta.title}">\n`;
    result += `<meta property="og:description" content="${meta.description}">\n`;
    if (meta.ogImage) result += `<meta property="og:image" content="${meta.ogImage}">\n\n`;

    result += `<!-- Twitter -->\n`;
    result += `<meta property="twitter:card" content="${meta.twitterCard}">\n`;
    result += `<meta property="twitter:url" content="${meta.ogUrl}">\n`;
    result += `<meta property="twitter:title" content="${meta.title}">\n`;
    result += `<meta property="twitter:description" content="${meta.description}">\n`;
    if (meta.ogImage) result += `<meta property="twitter:image" content="${meta.ogImage}">`;

    setOutput(result.trim());
  };

  useEffect(() => {
    generate();
  }, [meta]);

  const handleChange = (field: string, value: string) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
           <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                 <Tags className="w-4 h-4" /> Essential Config
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Page Title</label>
                    <input type="text" value={meta.title} onChange={e => handleChange('title', e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                       <span className={`text-[10px] font-black ${meta.description.length > 160 ? 'text-red-500' : 'text-primary'}`}>{meta.description.length} / 160</span>
                    </div>
                    <textarea value={meta.description} onChange={e => handleChange('description', e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-24" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Keywords</label>
                       <input type="text" value={meta.keywords} onChange={e => handleChange('keywords', e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Author</label>
                       <input type="text" value={meta.author} onChange={e => handleChange('author', e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-500">
                    <Share2 className="w-4 h-4" /> Social & Rich Media
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Canonical URL</label>
                       <input type="text" value={meta.ogUrl} onChange={e => handleChange('ogUrl', e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Social Image URL</label>
                       <input type="text" value={meta.ogImage} onChange={e => handleChange('ogImage', e.target.value)} className="w-full border rounded-xl p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">HTML Snippet</span>
                <div className="flex items-center gap-3">
                   <button onClick={() => downloadFile(new Blob([output]), 'meta-tags.html')} className="text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                   </button>
                   <button
                      onClick={async () => { await copyToClipboard(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="text-[10px] font-black text-primary uppercase hover:underline"
                   >
                      {copied ? 'Copied!' : 'Copy Snippet'}
                   </button>
                </div>
              </div>
              <textarea
                readOnly
                className="flex-1 p-6 font-mono text-[11px] bg-transparent outline-none resize-none leading-relaxed text-indigo-600 dark:text-indigo-400"
                value={output}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
