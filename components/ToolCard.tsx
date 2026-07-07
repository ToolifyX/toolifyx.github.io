import React from 'react';
import Link from 'next/link';
import { Tool } from '@/tools/types';
import { DynamicIcon } from './DynamicIcon';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const theme = tool.themeColor || 'blue';

  const themeClasses: Record<string, string> = {
    blue: 'bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:bg-blue-100/50 text-blue-600',
    indigo: 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-100/50 text-indigo-600',
    cyan: 'bg-cyan-50/50 border-cyan-100 hover:border-cyan-300 hover:bg-cyan-100/50 text-cyan-600',
    sky: 'bg-sky-50/50 border-sky-100 hover:border-sky-300 hover:bg-sky-100/50 text-sky-600',
    violet: 'bg-violet-50/50 border-violet-100 hover:border-violet-300 hover:bg-violet-100/50 text-violet-600',
    slate: 'bg-slate-50/50 border-slate-100 hover:border-slate-300 hover:bg-slate-100/50 text-slate-600',
    orange: 'bg-orange-50/50 border-orange-100 hover:border-orange-300 hover:bg-orange-100/50 text-orange-600',
    amber: 'bg-amber-50/50 border-amber-100 hover:border-amber-300 hover:bg-amber-100/50 text-amber-600',
    yellow: 'bg-yellow-50/50 border-yellow-100 hover:border-yellow-300 hover:bg-yellow-100/50 text-yellow-600',
    red: 'bg-red-50/50 border-red-100 hover:border-red-300 hover:bg-red-100/50 text-red-600',
    rose: 'bg-rose-50/50 border-rose-100 hover:border-rose-300 hover:bg-rose-100/50 text-rose-600',
    green: 'bg-green-50/50 border-green-100 hover:border-green-300 hover:bg-green-100/50 text-green-600',
    emerald: 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100/50 text-emerald-600',
    teal: 'bg-teal-50/50 border-teal-100 hover:border-teal-300 hover:bg-teal-100/50 text-teal-600',
    purple: 'bg-purple-50/50 border-purple-100 hover:border-purple-300 hover:bg-purple-100/50 text-purple-600',
    pink: 'bg-pink-50/50 border-pink-100 hover:border-pink-300 hover:bg-pink-100/50 text-pink-600',
    fuchsia: 'bg-fuchsia-50/50 border-fuchsia-100 hover:border-fuchsia-300 hover:bg-fuchsia-100/50 text-fuchsia-600',
    zinc: 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100/50 text-zinc-600',
    neutral: 'bg-neutral-50/50 border-neutral-100 hover:border-neutral-300 hover:bg-neutral-100/50 text-neutral-600',
  };

  const currentTheme = themeClasses[theme] || themeClasses.blue;

  return (
    <Link href={`/tools/${tool.slug}`} title={tool.title}>
      <div className={`h-full p-5 border rounded-2xl transition-all duration-300 flex flex-col group relative overflow-hidden shadow-sm ${currentTheme.split(' ').slice(0, 2).join(' ')} ${currentTheme.split(' ').slice(2).join(' ')}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 shadow-sm bg-white dark:bg-card ${tool.iconColor?.split(' ')[0] || 'text-primary'}`}>
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={24} strokeWidth={2} />
          </div>
          <div className="space-y-1.5 min-w-0 pt-0.5">
            <h3 className="text-base font-bold text-foreground leading-none tracking-tight transition-colors">
              {tool.title}
            </h3>
            <p className="text-[13px] text-muted-foreground/90 leading-relaxed line-clamp-2 font-medium">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Subtle hover indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className={`w-8 h-8 rounded-full bg-white dark:bg-card border border-inherit flex items-center justify-center shadow-sm ${currentTheme.split(' ').pop()}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
