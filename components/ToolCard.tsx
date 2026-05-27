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
      <div className="h-full p-5 border-2 border-black dark:border-white rounded-lg bg-card hover:-translate-y-1 hover:translate-x-1 shadow-neo hover:shadow-neo-lg transition-all flex flex-col space-y-4 group">
        <div className="flex flex-col space-y-3">
          <div className="p-3 w-fit rounded-lg border-2 border-black dark:border-white bg-primary text-primary-foreground shadow-neo-sm transition-all">
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={32} strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black group-hover:text-primary transition-colors leading-tight tracking-tighter uppercase">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-snug font-bold">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
           <span className="text-[10px] font-black bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
            {tool.category}
          </span>
          <div className="p-1.5 rounded-md border-2 border-black dark:border-white bg-white text-black group-hover:bg-primary group-hover:text-white transition-all shadow-neo-sm group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
