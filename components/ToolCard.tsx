import React from 'react';
import Link from 'next/link';
import { Tool } from '@/tools/types';
import { DynamicIcon } from './DynamicIcon';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} title={tool.title}>
      <div className="h-full p-6 border rounded-2xl bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col space-y-4 group">
        <div className="flex flex-col space-y-4">
          <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={24} strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            {tool.category}
          </span>
          <div className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
