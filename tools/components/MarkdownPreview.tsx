"use client";

/**
 * SEO Title: Online Markdown Previewer - Real-time Editor & HTML Converter
 * Meta Description: Write Markdown and preview it instantly in your browser. Convert Markdown to HTML and vice versa with syntax highlighting.
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { Eye, Code, FileText, Download, RefreshCw } from 'lucide-react';
import { Tool } from '@/tools/types';

interface Props {
  tool: Tool;
}

export default function MarkdownPreview({ tool }: Props) {
  const isHtmlToMd = tool?.slug === 'html-to-markdown';
  const isMdToHtml = tool?.slug === 'markdown-to-html';

  const initialText = isHtmlToMd
    ? '<h1>Hello World</h1>\n<p>This is <b>HTML</b></p>'
    : '# Markdown Preview\n\nType here to see the **magic** happen!\n\n- Lists\n- Tables\n- [Links](https://ssolstice.dev)\n\n```js\nconsole.log("Hello World");\n```';

  const [input, setInput] = useState(initialText);
  const [output, setOutput] = useState('');
  const [view, setView] = useState<'preview' | 'html'>(isMdToHtml ? 'html' : 'preview');
  const [copied, setCopied] = useState(false);

  // Basic HTML to Markdown (Very simplified for zero-dep)
  const htmlToMd = (html: string) => {
    return html
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n')
      .replace(/<b>(.*?)<\/b>/gim, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<i>(.*?)<\/i>/gim, '*$1*')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<p>(.*?)<\/p>/gim, '$1\n\n')
      .replace(/<li>(.*?)<\/li>/gim, '- $1\n')
      .replace(/<a href=['"](.*?)['"].*?>(.*?)<\/a>/gim, '[$2]($1)')
      .replace(/<br\s*\/?>/gim, '\n')
      .replace(/<[^>]*>?/gm, ''); // Strip remaining tags
  };

  // Basic Markdown to HTML
  const mdToHtml = (md: string) => {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>")
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '<br />')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/gim, '<code>$1</code>');
  };

  useEffect(() => {
    if (isHtmlToMd) {
      setOutput(htmlToMd(input));
    } else {
      setOutput(mdToHtml(input));
    }
  }, [input, isHtmlToMd]);

  const handleCopy = async () => {
    const finalCopy = isHtmlToMd ? output : (view === 'preview' ? input : output);
    const success = await copyToClipboard(finalCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = isHtmlToMd ? output : (view === 'preview' ? input : output);
    const ext = isHtmlToMd ? 'md' : (view === 'preview' ? 'md' : 'html');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-[700px] bg-background">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col border-r border-border h-full">
        <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <FileText className="w-3 h-3" /> {isHtmlToMd ? 'HTML Editor' : 'Markdown Editor'}
          </div>
          <button onClick={() => setInput('')} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Clear</button>
        </div>
        <textarea
          className="flex-1 p-6 font-mono text-sm resize-none outline-none bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isHtmlToMd ? "Paste HTML here..." : "Write your markdown here..."}
        />
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col h-full bg-card/50">
        <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 justify-between">
          <div className="flex gap-2">
            {!isHtmlToMd && (
              <button
                onClick={() => setView('preview')}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'preview' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
            )}
            <button
              onClick={() => setView('html')}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'html' || isHtmlToMd ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {isHtmlToMd ? <RefreshCw className="w-3 h-3" /> : <Code className="w-3 h-3" />}
              {isHtmlToMd ? 'Markdown Result' : 'HTML Result'}
            </button>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={handleDownload} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors" title="Download">
                <Download className="w-4 h-4" />
             </button>
             <button onClick={handleCopy} className="text-xs font-bold text-primary hover:underline px-2">
                {copied ? 'Copied!' : 'Copy'}
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 prose prose-sm dark:prose-invert max-w-none">
          {view === 'preview' && !isHtmlToMd ? (
            <div dangerouslySetInnerHTML={{ __html: output }} className="markdown-body" />
          ) : (
            <pre className="bg-muted/20 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap break-all h-full overflow-auto">
              {output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
