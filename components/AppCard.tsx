import React from 'react';
import { MobileApp } from '@/lib/appsData';
import { DynamicIcon } from './DynamicIcon';
import { ExternalLink } from 'lucide-react';

interface AppCardProps {
  app: MobileApp;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <a
      href={`https://play.google.com/store/apps/details?id=${app.packageId}`}
      target="_blank"
      rel="noopener noreferrer"
      title={app.name}
    >
      <div className="h-full p-5 border rounded-2xl transition-all duration-300 flex flex-col group relative overflow-hidden shadow-sm bg-primary/[0.03] border-primary/10 hover:border-primary/30 hover:bg-primary/[0.08]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 shadow-sm bg-white dark:bg-card border border-border/50 overflow-hidden">
            {app.iconPath ? (
              <img src={app.iconPath} alt={app.name} className="w-full h-full object-cover" />
            ) : (
              <DynamicIcon name={app.iconName || 'HelpCircle'} size={24} strokeWidth={2} className="text-primary" />
            )}
          </div>
          <div className="space-y-1.5 min-w-0 pt-0.5">
            <h3 className="text-base font-bold text-foreground leading-none tracking-tight transition-colors group-hover:text-primary">
              {app.name}
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 font-semibold">
              {app.description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
