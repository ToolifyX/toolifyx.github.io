import React from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import { ToolCategory } from '@/tools/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ToolifyX - All-in-One Free Online Tool Platform',
  description: 'Access 50+ free browser-based tools for developers, designers, and creators. Secure, private, and fast utilities for daily tasks.',
};

const categories: { id: ToolCategory; label: string; href: string; description: string }[] = [
  { id: 'dev', label: 'Developer Tools', href: '/dev-tools', description: 'JSON, Base64, UUID, and more.' },
  { id: 'text', label: 'Text Tools', href: '/text-tools', description: 'Case conversion, word counts, and cleaning.' },
  { id: 'image', label: 'Image Tools', href: '/image-tools', description: 'Compress, convert, and resize images.' },
  { id: 'pdf', label: 'PDF Tools', href: '/pdf-tools', description: 'Merge, split, and manage PDF files.' },
  { id: 'design', label: 'Design Tools', href: '/design-tools', description: 'Color pickers, gradients, and CSS shadows.' },
  { id: 'utility', label: 'Utility Tools', href: '/utility-tools', description: 'QR codes, passwords, and unit converters.' },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12 md:py-24">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
          EVERY TOOL <span className="text-primary italic">INSTANTLY.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          No signup. No server uploads. Just fast, private, browser-based tools for modern creators.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={cat.href}
              className="px-4 py-1.5 rounded-full border text-sm font-medium hover:bg-muted transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-24">
        {categories.map((cat) => {
          const categoryTools = tools.filter((t) => t.category === cat.id);
          if (categoryTools.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight">{cat.label}</h2>
                  <p className="text-muted-foreground">{cat.description}</p>
                </div>
                <Link
                  href={cat.href}
                  className="text-primary font-bold hover:underline flex items-center gap-1 transition-all group"
                >
                  View all {categoryTools.length} {cat.label}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.slice(0, 6).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
