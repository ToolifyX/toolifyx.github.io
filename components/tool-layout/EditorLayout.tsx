"use client";

import React from 'react';

interface EditorLayoutProps {
  leftPanel: React.ReactNode;
  mainCanvas: React.ReactNode;
  rightPanel: React.ReactNode;
  bottomBar?: React.ReactNode;
}

export default function EditorLayout({ leftPanel, mainCanvas, rightPanel, bottomBar }: EditorLayoutProps) {
  return (
    <div className="flex flex-col min-h-[700px] w-full bg-background relative border border-border rounded-3xl overflow-hidden shadow-2xl">
      {/* Three Panel Layout */}
      <div className="flex flex-col lg:flex-row flex-1 w-full overflow-hidden">

        {/* Main Area: The Canvas (First on mobile) */}
        <main className="order-1 lg:order-2 flex-1 bg-muted/10 overflow-hidden relative flex flex-col min-h-[500px] lg:min-h-[700px] border-b lg:border-b-0 lg:border-x border-border">
          <div className="flex-1 relative flex items-center justify-center p-6 md:p-12">
            {mainCanvas}
          </div>
        </main>

        {/* Left Panel: Controls (Second on mobile) */}
        <aside className="order-2 lg:order-1 w-full lg:w-[320px] bg-card overflow-y-auto border-b lg:border-b-0 border-border">
          <div className="p-6 space-y-8">
            {leftPanel}
          </div>
        </aside>

        {/* Right Panel: Result & Preview (Third on mobile) */}
        <aside className="order-3 w-full lg:w-[320px] bg-card overflow-y-auto">
          <div className="p-6 space-y-8">
            {rightPanel}
          </div>
        </aside>
      </div>

      {/* Optional Sticky Bottom Bar */}
      {bottomBar && (
        <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-20 px-6 py-4">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
            {bottomBar}
          </div>
        </div>
      )}
    </div>
  );
}
