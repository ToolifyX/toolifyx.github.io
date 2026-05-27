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
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: seo?.seoTitle || `${tool.title} - Free Online Tool`,
    description: seo?.metaDescription || tool.description,
    openGraph: {
      title: seo?.seoTitle || `${tool.title} - Free Online Tool`,
      description: seo?.metaDescription || tool.description,
    },
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  const seo = seoData[params.slug];

  if (!tool) {
    notFound();
  }

  const sameCategoryTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 5);

  const differentCategoryTools = tools
    .filter((t) => t.category !== tool.category)
    .slice(0, 0); // Keep it same category mostly for speed

  const allRelatedTools = [...sameCategoryTools, ...differentCategoryTools];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (seo?.faqs || [
      { question: "Is this tool free?", answer: "Yes, 100% free." },
      { question: "Is it secure?", answer: "All processing is local." },
      { question: "No install?", answer: "Runs in browser." }
    ]).map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb - Compact */}
      <nav className="flex text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
        <ol className="flex items-center space-x-1">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li><span>/</span></li>
          <li><Link href={`/${tool.category}-tools`} className="hover:text-foreground">{tool.category} Tools</Link></li>
          <li><span>/</span></li>
          <li className="text-foreground">{tool.title}</li>
        </ol>
      </nav>

      {/* Header - Larger */}
      <div className="flex items-center space-x-4 py-4">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm">
          <DynamicIcon name={tool.icon || 'HelpCircle'} size={40} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">{tool.title}</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">{tool.description}</p>
        </div>
      </div>

      {/* Tool Main Area */}
      <div className="bg-card border-2 rounded-2xl overflow-hidden shadow-md">
        <div className="px-3 py-1.5 bg-muted/50 border-b flex items-center justify-between">
          <div className="flex space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            {tool.category} Utility
          </span>
        </div>
        <div className="p-3 md:p-6">
          <ToolRenderer componentName={tool.component} />
        </div>
      </div>

      {/* Content Grid - Dense */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2 space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold">How to use</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(seo?.howToUse || ["Input data", "Process", "Get result"]).map((step, i) => (
                <li key={i} className="p-3 bg-muted/30 rounded-lg border text-xs leading-relaxed">
                  <span className="font-black text-primary mr-1">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">About {tool.title}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fast, secure, and browser-based. All processing for <strong>{tool.title}</strong> is done locally on your device.
              No data is uploaded to our servers, ensuring your privacy remains 100% intact.
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <h2 className="text-lg font-bold">FAQ</h2>
          <div className="space-y-3">
            {(seo?.faqs || []).slice(0, 3).map((faq, i) => (
              <div key={i} className="space-y-1">
                <h3 className="text-xs font-bold">{faq.question}</h3>
                <p className="text-[11px] text-muted-foreground leading-snug">{faq.answer}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Related Tools - Dense Grid */}
      {allRelatedTools.length > 0 && (
        <section className="space-y-3 pt-6 border-t">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold tracking-tight">More {tool.category} Tools</h2>
            <Link href={`/${tool.category}-tools`} className="text-xs text-primary font-bold hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRelatedTools.map((related) => (
              <ToolCard key={related.slug} tool={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
