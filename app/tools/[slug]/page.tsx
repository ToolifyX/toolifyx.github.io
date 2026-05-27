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
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header & Breadcrumb */}
      <div className="space-y-3 pt-6">
        <nav className="flex items-center space-x-2 text-[12px] text-muted-foreground font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">{tool.title}</span>
        </nav>

        <div className="flex items-start md:items-end gap-5">
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-none">
              {tool.title}
            </h1>
            <p className="text-[14px] md:text-[16px] text-gray-500 font-medium leading-relaxed max-w-2xl">
              {tool.description}
            </p>
          </div>
          <div className="hidden md:block">
             <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-sm">
                <DynamicIcon name={tool.icon || 'HelpCircle'} size={24} strokeWidth={2} />
             </div>
          </div>
        </div>
      </div>

      {/* Workspace Canvas (App Window) */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* macOS Style Bar */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="w-3 h-3 rounded-full bg-gray-200" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Web Utility
          </span>
        </div>

        {/* Actual Tool Canvas */}
        <div className="p-4 md:p-8 min-h-[400px]">
          <ToolRenderer componentName={tool.component} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-10 border-t border-gray-200">
        <div className="md:col-span-8 space-y-10">
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">How to use {tool.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(seo?.howToUse || ["Input your files or text", "Adjust any specific settings", "Download or copy result"]).map((step, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <span className="text-xl font-bold text-gray-300">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[14px] text-gray-500 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {(seo?.faqs || [
                { question: "Is my data safe?", answer: "Yes, all processing happens locally in your browser. No data is ever uploaded to our servers." },
                { question: "Do I need to pay?", answer: "No, ToolifyX is completely free to use without any limitations." }
              ]).map((faq, i) => (
                <div key={i} className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="md:col-span-4 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Related Tools</h2>
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
