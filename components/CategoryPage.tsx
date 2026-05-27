import React, { useMemo } from 'react';
import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';
import { ToolCategory, ImageSubCategory } from '@/tools/types';
import Link from 'next/link';

interface CategoryPageProps {
  category: ToolCategory;
  title: string;
  description: string;
}

export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  const filteredTools = useMemo(() => tools.filter((t) => t.category === category), [category]);

  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof filteredTools> = {};
    const subCategories: string[] = [];

    filteredTools.forEach((tool) => {
      const subCat = tool.subCategory || 'Other';
      if (!groups[subCat]) {
        groups[subCat] = [];
        subCategories.push(subCat);
      }
      groups[subCat].push(tool);
    });

    return { groups, subCategories };
  }, [filteredTools]);

  const hasSubCategories = groupedTools.subCategories.length > 1 || (groupedTools.subCategories.length === 1 && groupedTools.subCategories[0] !== 'Other');

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

      {hasSubCategories ? (
        <div className="space-y-16">
          {groupedTools.subCategories.map((subCat) => (
            <div key={subCat} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">{subCat}</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTools.groups[subCat].map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}

      {filteredTools.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">No tools found in this category yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
