"use client";

import React from 'react';
import { mobileApps } from '@/lib/appsData';
import { DynamicIcon } from '@/components/DynamicIcon';
import { ArrowUpRight, Smartphone, ExternalLink } from 'lucide-react';

export default function AppsPage() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 pt-10">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
           <Smartphone className="w-3 h-3" /> Our Mobile Apps
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Tools for your <span className="text-primary">Pocket.</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Take the power of ToolifyX on the go. Our mobile apps are designed to be lightweight, secure, and incredibly useful.
        </p>
      </div>

      {/* Featured Apps Section */}
      <div className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-2">
          Featured Apps
          <div className="h-px flex-1 bg-border/60"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mobileApps.filter(app => app.featured).map((app) => (
            <a
              key={app.id}
              href={`https://play.google.com/store/apps/details?id=${app.packageId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <DynamicIcon name={app.iconName} className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{app.category}</span>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">{app.name}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {app.description}
                  </p>
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                      Get on Google Play
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* More Apps Grid */}
      <div className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-2">
          More from us
          <div className="h-px flex-1 bg-border/60"></div>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mobileApps.filter(app => !app.featured).map((app) => (
            <a
              key={app.id}
              href={`https://play.google.com/store/apps/details?id=${app.packageId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-5 rounded-2xl border bg-card/50 hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                  <DynamicIcon name={app.iconName} className="w-6 h-6 text-muted-foreground group-hover:text-primary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{app.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{app.category}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                {app.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                 <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                   Details <ExternalLink className="w-2.5 h-2.5" />
                 </span>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-5 w-auto" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Developer Profile Link */}
      <div className="pt-10 text-center">
        <a
          href="https://play.google.com/store/apps/dev?id=4762229976399806756"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all hover:gap-3"
        >
          View our full developer profile on Google Play
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
