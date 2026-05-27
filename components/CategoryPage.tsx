import React from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import { ToolCategory } from '@/tools/types';
import Link from 'next/link';

interface CategoryPageProps {
  category: ToolCategory;
  title: string;
  description: string;
}

export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  const filteredTools = tools.filter((t) => t.category === category);

  return (
    <div className="space-y-12 pb-20">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span className="text-foreground font-medium">{title}</span>
          </li>
        </ol>
      </nav>

      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">No tools found in this category yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
