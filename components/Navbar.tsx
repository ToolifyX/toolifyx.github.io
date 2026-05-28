'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
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
    dev: 'Developer Tools',
    text: 'Text Tools',
    design: 'Design Tools',
    utility: 'Utility Tools',
  };

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

          {/* Desktop Quick Access Links - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-1 flex-1 mx-6">
            {QUICK_ACCESS_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.route}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-md ${
                  isToolActive(tool.slug)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 underline'
                    : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline'
                }`}
              >
                {tool.title}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* More Tools Dropdown - Desktop */}
            <div className="hidden md:block relative group">
              <button className="px-3 py-2 text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors flex items-center gap-1 rounded-md group-hover:bg-accent">
                More Tools
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-0 w-56 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {Object.entries(otherToolsByCategory).map(([category, categoryTools]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {categoryLabels[category] || category}
                      </div>
                      {categoryTools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isToolActive(tool.slug)
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-foreground hover:bg-accent'
                          }`}
                        >
                          {tool.title}
                        </Link>
                      ))}
                    </div>
                  ))}
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
                <div className="mt-2 ml-3 space-y-2 border-l-2 border-border pl-3">
                  {Object.entries(otherToolsByCategory).map(([category, categoryTools]) => (
                    <div key={category} className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
                        {categoryLabels[category] || category}
                      </div>
                      {categoryTools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className={`block px-2 py-1 text-sm rounded transition-colors ${
                            isToolActive(tool.slug)
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-foreground hover:bg-accent/50'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {tool.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tablet Scrollable Row - Hidden on desktop/mobile */}
        <div className="hidden md:flex lg:hidden overflow-x-auto pb-3 pt-2 px-4 gap-2 scrollbar-hide">
          <div className="flex gap-2 flex-shrink-0">
            {QUICK_ACCESS_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.route}
                className={`px-3 py-1 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors rounded-md flex-shrink-0 ${
                  isToolActive(tool.slug)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 underline'
                    : 'text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline'
                }`}
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
