"use client";

import React from 'react';
import { ResizeSettings } from './resizeUtils';
import { Maximize2, Percent, Settings2, Download, Archive, Loader2, Check } from 'lucide-react';

interface ResizeControlsProps {
  settings: ResizeSettings;
  setSettings: React.Dispatch<React.SetStateAction<ResizeSettings>>;
  onDownloadAll: () => void;
  isProcessing: boolean;
  hasImages: boolean;
}

export default function ResizeControls({ settings, setSettings, onDownloadAll, isProcessing, hasImages }: ResizeControlsProps) {
  const updateSetting = <K extends keyof ResizeSettings>(key: K, value: ResizeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-card border-l overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Resize Settings
        </h2>
      </div>

      <div className="p-4 space-y-8">
        {/* Resize Mode Toggle */}
        <div className="p-1 bg-muted rounded-xl flex gap-1">
          <button
            onClick={() => updateSetting('mode', 'percentage')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              settings.mode === 'percentage' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Percent className="w-3 h-3" /> Percentage
          </button>
          <button
            onClick={() => updateSetting('mode', 'dimensions')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              settings.mode === 'dimensions' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Maximize2 className="w-3 h-3" /> Dimensions
          </button>
        </div>

        {/* Mode Specific Controls */}
        <div className="space-y-4">
          {settings.mode === 'percentage' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Zoom Level</label>
                <span className="text-sm font-black text-primary">{settings.percentage}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={settings.percentage}
                onChange={(e) => updateSetting('percentage', parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[25, 50, 75, 150].map(p => (
                  <button
                    key={p}
                    onClick={() => updateSetting('percentage', p)}
                    className="py-1.5 text-[10px] font-bold bg-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">Width (px)</label>
                <input
                  type="number"
                  value={settings.width}
                  onChange={(e) => updateSetting('width', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-muted border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">Height (px)</label>
                <input
                  type="number"
                  value={settings.height}
                  onChange={(e) => updateSetting('height', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-muted border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Global Options - Only shown in Dimensions mode */}
        {settings.mode === 'dimensions' && (
          <div className="space-y-4 pt-4 border-t">
            <label className="text-[11px] font-bold text-muted-foreground uppercase">Global Options</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.maintainAspectRatio}
                    onChange={(e) => updateSetting('maintainAspectRatio', e.target.checked)}
                    className="peer h-5 w-5 appearance-none rounded-lg bg-muted border-none checked:bg-primary transition-all cursor-pointer"
                  />
                  <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Maintain aspect ratio</span>
              </label>

              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.noEnlarge}
                    onChange={(e) => updateSetting('noEnlarge', e.target.checked)}
                    className="peer h-5 w-5 appearance-none rounded-lg bg-muted border-none checked:bg-primary transition-all cursor-pointer"
                  />
                  <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Do not enlarge if smaller</span>
              </label>
            </div>
          </div>
        )}

        {/* Export Format */}
        <div className="space-y-4 pt-4 border-t">
          <label className="text-[11px] font-bold text-muted-foreground uppercase">Export Settings</label>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'jpeg', 'webp'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => updateSetting('format', fmt)}
                className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                  settings.format === fmt ? 'bg-primary border-primary text-white' : 'bg-muted border-transparent hover:border-primary/30'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
          {settings.format !== 'png' && (
             <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">Quality</label>
                  <span className="text-xs font-black text-primary">{settings.quality}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.quality}
                  onChange={(e) => updateSetting('quality', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
             </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-8 border-t space-y-3">
          <button
            onClick={onDownloadAll}
            disabled={!hasImages || isProcessing}
            className="w-full bg-black text-white px-4 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
            Download All (ZIP)
          </button>
          <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
            {hasImages ? 'All processing is client-side' : 'Upload images to enable export'}
          </p>
        </div>
      </div>
    </div>
  );
}
