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
      <div className="h-full p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 flex flex-col group relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 transition-all group-hover:bg-primary group-hover:text-white">
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={20} strokeWidth={2} />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="text-[15px] font-bold text-gray-900 leading-none tracking-tight group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Subtle hover indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
