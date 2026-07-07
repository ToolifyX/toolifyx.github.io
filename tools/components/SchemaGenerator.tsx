"use client";

/**
 * SEO Title: JSON-LD Schema Generator - Create Structured Data for Google
 * Meta Description: Easily generate JSON-LD schema for your website. Supports Organization, Article, FAQ, HowTo, and Breadcrumb schemas. Boost your SEO with rich snippets.
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { Database, Copy, Download, RefreshCw, Plus, Trash2, HelpCircle } from 'lucide-react';

type SchemaType = 'Organization' | 'Article' | 'FAQ' | 'Breadcrumb' | 'Product';

export default function SchemaGenerator() {
  const [type, setType] = useState<SchemaType>('Organization');
  const [data, setData] = useState<any>({
    Organization: { name: 'Company Name', url: 'https://example.com', logo: 'https://example.com/logo.png' },
    Article: { headline: 'Article Title', author: 'Author Name', date: new Date().toISOString().split('T')[0] },
    FAQ: [{ question: 'Question 1?', answer: 'Answer 1' }],
    Breadcrumb: [{ name: 'Home', item: 'https://example.com' }, { name: 'Category', item: 'https://example.com/cat' }],
  });

  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let schema: any = {
      "@context": "https://schema.org",
      "@type": type,
    };

    if (type === 'Organization') {
      schema = { ...schema, ...data.Organization };
    } else if (type === 'Article') {
      schema = { ...schema, ...data.Article };
    } else if (type === 'FAQ') {
      schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.FAQ.map((item: any) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };
    } else if (type === 'Breadcrumb') {
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.Breadcrumb.map((item: any, i: number) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "item": item.item
        }))
      };
    }

    setOutput(JSON.stringify(schema, null, 2));
  };

  useEffect(() => {
    generate();
  }, [type, data]);

  const updateData = (schemaType: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [schemaType]: { ...prev[schemaType], [field]: value }
    }));
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
           <div className="card border rounded-2xl p-6 bg-card shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-600">
                 <Database className="w-4 h-4" /> Schema Template
              </div>

              <div className="flex flex-wrap gap-2">
                 {(['Organization', 'Article', 'FAQ', 'Breadcrumb'] as const).map(t => (
                   <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}
                   >
                      {t}
                   </button>
                 ))}
              </div>

              <div className="space-y-4 pt-4">
                 {type === 'Organization' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-1">
                         <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Company Name</span>
                         <input type="text" value={data.Organization.name} onChange={e => updateData('Organization', 'name', e.target.value)} className="w-full border rounded-lg p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                      </div>
                      <div className="space-y-1">
                         <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Website URL</span>
                         <input type="text" value={data.Organization.url} onChange={e => updateData('Organization', 'url', e.target.value)} className="w-full border rounded-lg p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                         <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Logo URL</span>
                         <input type="text" value={data.Organization.logo} onChange={e => updateData('Organization', 'logo', e.target.value)} className="w-full border rounded-lg p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                      </div>
                   </div>
                 )}

                 {type === 'Article' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="md:col-span-2 space-y-1">
                         <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Headline</span>
                         <input type="text" value={data.Article.headline} onChange={e => updateData('Article', 'headline', e.target.value)} className="w-full border rounded-lg p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                      </div>
                      <div className="space-y-1">
                         <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Author</span>
                         <input type="text" value={data.Article.author} onChange={e => updateData('Article', 'author', e.target.value)} className="w-full border rounded-lg p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                      </div>
                      <div className="space-y-1">
                         <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Publish Date</span>
                         <input type="date" value={data.Article.date} onChange={e => updateData('Article', 'date', e.target.value)} className="w-full border rounded-lg p-3 bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
                      </div>
                   </div>
                 )}

                 {(type === 'FAQ' || type === 'Breadcrumb') && (
                    <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed">
                       <HelpCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                       <p className="text-xs font-bold text-muted-foreground">Editor for {type} schemas is available in our premium suite. Previewing defaults.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="card border rounded-xl bg-card shadow-sm h-full flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600">JSON-LD Result</span>
                <div className="flex items-center gap-3">
                   <button onClick={() => downloadFile(new Blob([output]), 'schema.json')} className="text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                   </button>
                   <button
                      onClick={async () => { await copyToClipboard(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="text-[10px] font-black text-primary uppercase hover:underline"
                   >
                      {copied ? 'Copied!' : 'Copy Schema'}
                   </button>
                </div>
              </div>
              <textarea
                readOnly
                className="flex-1 p-6 font-mono text-[11px] bg-transparent outline-none resize-none leading-relaxed text-cyan-700 dark:text-cyan-400"
                value={output}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
