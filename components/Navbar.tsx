'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { DynamicIcon } from './DynamicIcon';
import { QUICK_ACCESS_TOOLS } from '@/tools/quickAccessTools';
import { tools } from '@/tools/config';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);

  // Get quick access toolSlugs for comparison
  const quickAccessSlugs = QUICK_ACCESS_TOOLS.map(t => t.slug);

  // Group all non-quick-access tools by category
  const otherToolsByCategory = tools
    .filter(tool => !quickAccessSlugs.includes(tool.slug))
    .reduce((acc, tool) => {
      const category = tool.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(tool);
      return acc;
    }, {} as Record<string, typeof tools>);

  const categoryLabels: Record<string, string> = {
    image: 'Image Tools',
    pdf: 'PDF Tools',
    dev: 'Dev Tools',
    text: 'Text Tools',
    design: 'Design Tools',
    utility: 'Utility Tools',
  };
  const orderedCategories = ['image', 'pdf', 'dev', 'text', 'design', 'utility'];
  const orderedOtherToolsByCategory = orderedCategories
    .filter(category => otherToolsByCategory[category]?.length)
    .map(category => [category, otherToolsByCategory[category]] as const);

  const isToolActive = (slug: string) => {
    return pathname === `/tools/${slug}`;
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-0">
        {/* Main navbar row */}
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-lg transition-transform group-hover:scale-105">
              T
            </div>
            <span className="text-sm font-bold tracking-tight uppercase hidden sm:inline">
              Toolify<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Desktop Quick Access Links - Visible from tablet up */}
          {QUICK_ACCESS_TOOLS.length > 0 && (
            <div className="hidden md:flex items-center gap-1 flex-1 mx-4 overflow-x-auto scrollbar-hide">
              {QUICK_ACCESS_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.route}
                  className={`px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-all rounded-full border ${
                    isToolActive(tool.slug)
                      ? 'text-primary bg-primary/10 border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent border-transparent'
                  }`}
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          )}

          {/* Spacer if no quick access tools */}
          {QUICK_ACCESS_TOOLS.length === 0 && <div className="flex-1" />}

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* More Tools Dropdown - Desktop */}
            <div className="hidden md:block relative group">
              <button className="px-3 py-2 text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors flex items-center gap-1 rounded-md group-hover:bg-accent">
                More Tools
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Grid Dropdown Menu */}
              <div className="absolute right-0 mt-0 w-screen max-w-5xl bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 max-h-[32rem] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {orderedOtherToolsByCategory.map(([category, categoryTools]) => (
                    <div key={category} className="rounded-md border border-border/60 bg-background/60 p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {categoryLabels[category] || category}
                      </div>
                      <div className="space-y-0.5">
                        {categoryTools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-sm ${
                              isToolActive(tool.slug)
                                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                                : 'text-foreground hover:bg-accent'
                            }`}
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              {tool.icon && <DynamicIcon name={tool.icon} className="w-4 h-4" strokeWidth={1.5} />}
                            </div>
                            <span className="font-medium leading-tight truncate">{tool.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu - Dropdown below navbar */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 py-4 px-4 space-y-4">
            {/* Mobile More Tools Section */}
            <div>
              <button
                onClick={() => setMoreToolsOpen(!moreToolsOpen)}
                className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                More Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${moreToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile More Tools Submenu */}
              {moreToolsOpen && (
                <div className="mt-3 ml-3 space-y-5 border-l-2 border-border pl-3">
                  {orderedOtherToolsByCategory.map(([category, categoryTools]) => (
                    <div key={category} className="space-y-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
                        {categoryLabels[category] || category}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {categoryTools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors text-xs ${
                              isToolActive(tool.slug)
                                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                                : 'text-foreground hover:bg-accent/50'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="w-4 h-4 flex items-center justify-center shrink-0">
                              {tool.icon && <DynamicIcon name={tool.icon} className="w-3.5 h-3.5" strokeWidth={1.5} />}
                            </div>
                            <span className="font-medium leading-tight truncate">{tool.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tablet Scrollable Row removed as it's now in the main bar */}
      </div>
    </nav>
  );
}
