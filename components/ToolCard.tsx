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
      <div className="h-full p-8 border-4 border-black dark:border-white rounded-xl bg-card hover:-translate-y-2 hover:translate-x-2 shadow-neo-lg hover:shadow-neo-xl transition-all flex flex-col space-y-6 group">
        <div className="flex flex-col space-y-5">
          <div className="p-5 w-fit rounded-xl border-4 border-black dark:border-white bg-primary text-primary-foreground shadow-neo transition-all group-hover:bg-primary/90">
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={48} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black group-hover:underline decoration-4 underline-offset-4 transition-all leading-[1.1] tracking-tighter uppercase">
              {tool.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-bold">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4">
           <span className="text-xs font-black bg-black text-white dark:bg-white dark:text-black px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
            {tool.category}
          </span>
          <div className="p-2.5 rounded-lg border-4 border-black dark:border-white bg-white text-black group-hover:bg-primary group-hover:text-white transition-all shadow-neo group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1">
            <svg
              className="w-6 h-6"
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
