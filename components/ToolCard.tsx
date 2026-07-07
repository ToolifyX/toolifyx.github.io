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
    blue: 'bg-blue-600/[0.08] border-blue-600/20 hover:border-blue-600/40 hover:bg-blue-600/15 text-blue-700 dark:text-blue-400',
    indigo: 'bg-indigo-600/[0.08] border-indigo-600/20 hover:border-indigo-600/40 hover:bg-indigo-600/15 text-indigo-700 dark:text-indigo-400',
    cyan: 'bg-cyan-600/[0.08] border-cyan-600/20 hover:border-cyan-600/40 hover:bg-cyan-600/15 text-cyan-700 dark:text-cyan-400',
    sky: 'bg-sky-600/[0.08] border-sky-600/20 hover:border-sky-600/40 hover:bg-sky-600/15 text-sky-700 dark:text-sky-400',
    violet: 'bg-violet-600/[0.08] border-violet-600/20 hover:border-violet-600/40 hover:bg-violet-600/15 text-violet-700 dark:text-violet-400',
    slate: 'bg-slate-600/[0.08] border-slate-600/20 hover:border-slate-600/40 hover:bg-slate-600/15 text-slate-700 dark:text-slate-400',
    orange: 'bg-orange-600/[0.08] border-orange-600/20 hover:border-orange-600/40 hover:bg-orange-600/15 text-orange-700 dark:text-orange-400',
    amber: 'bg-amber-600/[0.08] border-amber-600/20 hover:border-amber-600/40 hover:bg-amber-600/15 text-amber-700 dark:text-amber-400',
    yellow: 'bg-yellow-600/[0.08] border-yellow-600/20 hover:border-yellow-600/40 hover:bg-yellow-600/15 text-yellow-700 dark:text-yellow-400',
    red: 'bg-red-600/[0.08] border-red-600/20 hover:border-red-600/40 hover:bg-red-600/15 text-red-700 dark:text-red-400',
    rose: 'bg-rose-600/[0.08] border-rose-600/20 hover:border-rose-600/40 hover:bg-rose-600/15 text-rose-700 dark:text-rose-400',
    green: 'bg-green-600/[0.08] border-green-600/20 hover:border-green-600/40 hover:bg-green-600/15 text-green-700 dark:text-green-400',
    emerald: 'bg-emerald-600/[0.08] border-emerald-600/20 hover:border-emerald-600/40 hover:bg-emerald-600/15 text-emerald-700 dark:text-emerald-400',
    teal: 'bg-teal-600/[0.08] border-teal-600/20 hover:border-teal-600/40 hover:bg-teal-600/15 text-teal-700 dark:text-teal-400',
    purple: 'bg-purple-600/[0.08] border-purple-600/20 hover:border-purple-600/40 hover:bg-purple-600/15 text-purple-700 dark:text-purple-400',
    pink: 'bg-pink-600/[0.08] border-pink-600/20 hover:border-pink-600/40 hover:bg-pink-600/15 text-pink-700 dark:text-pink-400',
    fuchsia: 'bg-fuchsia-600/[0.08] border-fuchsia-600/20 hover:border-fuchsia-600/40 hover:bg-fuchsia-600/15 text-fuchsia-700 dark:text-fuchsia-400',
    zinc: 'bg-zinc-600/[0.08] border-zinc-600/20 hover:border-zinc-600/40 hover:bg-zinc-600/15 text-zinc-700 dark:text-zinc-400',
    neutral: 'bg-neutral-600/[0.08] border-neutral-600/20 hover:border-neutral-600/40 hover:bg-neutral-600/15 text-neutral-700 dark:text-neutral-400',
  };

  const currentTheme = themeClasses[theme] || themeClasses.blue;

  return (
    <Link href={`/tools/${tool.slug}`} title={tool.title}>
      <div className={`h-full p-5 border rounded-2xl transition-all duration-300 flex flex-col group relative overflow-hidden shadow-sm ${currentTheme.split(' ').slice(0, 2).join(' ')} ${currentTheme.split(' ').slice(2).join(' ')}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 shadow-sm bg-white dark:bg-card border border-border/50 ${tool.iconColor?.split(' ')[0] || 'text-primary'}`}>
            <DynamicIcon name={tool.icon || 'HelpCircle'} size={24} strokeWidth={2} />
          </div>
          <div className="space-y-1.5 min-w-0 pt-0.5">
            <h3 className="text-base font-bold text-foreground leading-none tracking-tight transition-colors">
              {tool.title}
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 font-semibold">
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
