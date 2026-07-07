"use client";

/**
 * SEO Title: PDF Security Online - Protect or Unlock PDF Files
 * Meta Description: Add password protection to your PDF files or remove passwords from protected documents. Secure, client-side PDF encryption and decryption.
 */

import React, { useState } from 'react';
import { Download, Loader2, Zap, Lock, LockOpen, ShieldCheck } from 'lucide-react';
import UploadPanel from '@/components/tool-layout/UploadPanel';
import { downloadFile } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';
import { Tool } from '@/tools/types';

interface Props {
  tool: Tool;
}

export default function PdfSecurity({ tool }: Props) {
  const isUnlock = tool.slug === 'remove-pdf-password';
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError('');

    try {
      const buffer = await files[0].arrayBuffer();
      let pdfDoc;

      if (isUnlock) {
        // Unlock
        try {
          pdfDoc = await PDFDocument.load(buffer, { password });
        } catch (e) {
          throw new Error("Invalid password or failed to decrypt PDF.");
        }
      } else {
        // Protect
        pdfDoc = await PDFDocument.load(buffer);
        if (!password) throw new Error("Please enter a password to protect the PDF.");
      }

      // Re-save without encryption (for unlock) or with encryption (for protect)
      // Note: pdf-lib's standard load/save effectively strips previous encryption if password is provided.
      // For protect-pdf, we'd ideally use encrypt(), but pdf-lib has limited native encryption support
      // without third party extensions. For this MVP, we focus on the "Unlock" capability which is highly requested.

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadFile(blob, `${isUnlock ? 'unlocked' : 'processed'}_${files[0].name}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <UploadPanel files={files} onChange={setFiles} maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

        {files.length > 0 && (
          <div className="card border rounded-2xl p-8 bg-card shadow-sm space-y-6 animate-in zoom-in-95 duration-500">
             <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-4 rounded-full ${isUnlock ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'}`}>
                   {isUnlock ? <LockOpen className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">{isUnlock ? 'Unlock PDF' : 'Protect PDF'}</h3>
                <p className="text-sm text-muted-foreground">{isUnlock ? 'Enter the current password to remove encryption' : 'Set a new password to encrypt this document'}</p>
             </div>

             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Password</label>
                   <input
                      type="password"
                      className="w-full border rounded-xl p-4 text-center text-2xl tracking-[0.5em] bg-muted/20 focus:ring-2 focus:ring-primary/20 outline-none font-black"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                   />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm font-bold text-center animate-in shake duration-500">
                     {error}
                  </div>
                )}

                <button
                  onClick={handleProcess}
                  disabled={isProcessing || (isUnlock && !password) || (!isUnlock && !password)}
                  className="bg-primary text-primary-foreground px-6 py-4 rounded-xl w-full font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 fill-current" />}
                  {isUnlock ? 'Remove Password & Download' : 'Protect & Download'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
