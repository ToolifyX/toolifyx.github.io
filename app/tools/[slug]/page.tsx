import { tools, getToolBySlug } from '@/tools/config';
import { seoData } from '@/tools/seo';
import ToolRenderer from '@/components/ToolRenderer';
import ToolCard from '@/components/ToolCard';
import { DynamicIcon } from '@/components/DynamicIcon';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  const seo = seoData[params.slug];

  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  return {
    title: seo?.seoTitle || `${tool.title} - Online Utility`,
    description: seo?.metaDescription || tool.description,
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  const seo = seoData[params.slug];

  if (!tool) {
    notFound();
  }

  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full space-y-2 pt-4 px-4 md:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-[11px] text-muted-foreground font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">{tool.title}</span>
        </nav>

        <div className="flex items-start md:items-end gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-none">
              {tool.title}
            </h1>
            <p className="text-[13px] md:text-[14px] text-muted-foreground font-medium leading-relaxed max-w-2xl">
              {tool.description}
            </p>
          </div>
          <div className="hidden md:block">
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border ${tool.iconColor || 'bg-card border-border text-muted-foreground'}`}>
                <DynamicIcon name={tool.icon || 'HelpCircle'} size={20} strokeWidth={2} />
             </div>
          </div>
        </div>
      </div>

      {/* Workspace Canvas (App Window) - Full Screen Width */}
      <div className="w-full bg-card border-y border-border md:border md:rounded-xl overflow-hidden shadow-sm">
        {/* macOS Style Bar */}
        <div className="px-6 py-3 bg-muted border-b border-border flex items-center justify-between">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-border" />
            <div className="w-3 h-3 rounded-full bg-border" />
            <div className="w-3 h-3 rounded-full bg-border" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Web Utility
          </span>
        </div>

        {/* Actual Tool Canvas */}
        <div className="min-h-[700px] flex flex-col">
          <ToolRenderer tool={tool} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 pt-10 border-t border-border px-4 md:px-6 lg:px-8">
        <div className="md:col-span-8 space-y-10">
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">How to use {tool.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(seo?.howToUse || ["Input your files or text", "Adjust any specific settings", "Download or copy result"]).map((step, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-lg border border-border bg-card shadow-sm">
                  <span className="text-xl font-bold text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[14px] text-muted-foreground font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {(seo?.faqs || [
                { question: "Is my data safe?", answer: "Yes, all processing happens locally in your browser. No data is ever uploaded to our servers." },
                { question: "Do I need to pay?", answer: "No, ToolifyX is completely free to use without any limitations." }
              ]).map((faq, i) => (
                <div key={i} className="p-5 rounded-lg border border-border bg-card shadow-sm">
                  <h3 className="text-[15px] font-bold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="md:col-span-4 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Related Tools</h2>
          <div className="flex flex-col gap-3">
            {relatedTools.map((related) => (
              <ToolCard key={related.slug} tool={related} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
