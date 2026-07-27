"use client";

import PdfEditor from '@/tools/components/PdfEditor';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-black uppercase tracking-widest mb-6">Advanced PDF Editor</h1>
        <div className="border rounded-2xl overflow-hidden shadow-2xl bg-card">
           <PdfEditor />
        </div>
      </div>
    </div>
  );
}
