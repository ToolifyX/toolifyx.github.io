"use client";

import React from 'react';
import { Square, RectangleHorizontal, RectangleVertical, Smartphone, Monitor } from 'lucide-react';

export interface AspectRatio {
  id: string;
  label: string;
  value: number | null; // null for free crop
  icon: React.ReactNode;
}

export const aspectRatios: AspectRatio[] = [
  { id: 'free', label: 'Free', value: null, icon: <RectangleHorizontal className="w-4 h-4" /> },
  { id: '1:1', label: '1:1 (Square)', value: 1, icon: <Square className="w-4 h-4" /> },
  { id: '4:3', label: '4:3', value: 4 / 3, icon: <RectangleHorizontal className="w-4 h-4" /> },
  { id: '3:4', label: '3:4', value: 3 / 4, icon: <RectangleVertical className="w-4 h-4" /> },
  { id: '16:9', label: '16:9', value: 16 / 9, icon: <Monitor className="w-4 h-4" /> },
  { id: '9:16', label: '9:16', value: 9 / 16, icon: <Smartphone className="w-4 h-4" /> },
];

export const socialPresets: AspectRatio[] = [
  { id: 'insta-post', label: 'Instagram Post (1:1)', value: 1, icon: <Square className="w-4 h-4" /> },
  { id: 'insta-story', label: 'Instagram Story (9:16)', value: 9 / 16, icon: <Smartphone className="w-4 h-4" /> },
  { id: 'fb-cover', label: 'Facebook Cover (16:9)', value: 16 / 9, icon: <Monitor className="w-4 h-4" /> },
  { id: 'yt-thumb', label: 'YouTube Thumbnail (16:9)', value: 16 / 9, icon: <Monitor className="w-4 h-4" /> },
];

interface AspectRatioSelectorProps {
  selectedIds: string[];
  activeId: string;
  onChange: (ratio: AspectRatio) => void;
  title: string;
  items: AspectRatio[];
}

export default function AspectRatioSelector({ selectedIds, activeId, onChange, title, items }: AspectRatioSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border
                ${isActive || isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card border-border hover:bg-muted/50'}
              `}
            >
              <div className={`${isActive || isSelected ? 'opacity-100' : 'opacity-40'}`}>
                {item.icon}
              </div>
              <span className="truncate flex-1 text-left">{item.label}</span>
              {isSelected && !isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/50" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
