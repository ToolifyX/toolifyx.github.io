import { tools, getToolBySlug } from '@/tools/config';
import ToolRenderer from '@/components/ToolRenderer';
import ToolCard from '@/components/ToolCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.title} - Free Online Tool`,
    description: tool.description,
    openGraph: {
      title: `${tool.title} - Free Online Tool`,
      description: tool.description,
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

  if (!tool) {
    notFound();
  }

  const sameCategoryTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  const differentCategoryTools = tools
    .filter((t) => t.category !== tool.category)
    .slice(0, 2);

  const allRelatedTools = [...sameCategoryTools, ...differentCategoryTools];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this tool free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all tools on ToolifyX are 100% free with no hidden costs or subscriptions."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We use client-side processing, meaning your data never leaves your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to install anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No installation required. Everything runs directly in your modern web browser."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="capitalize">
            <Link href={`/?category=${tool.category}`} className="hover:text-foreground transition-colors">
              {tool.category} Tools
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span className="text-foreground font-medium">{tool.title}</span>
          </li>
        </ol>
      </nav>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tool.title}</h1>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-1 bg-muted/50 border-b flex items-center px-4 h-10">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          <span className="ml-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {tool.category} Tool
          </span>
        </div>
        <div className="p-6">
          <ToolRenderer componentName={tool.component} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How to use {tool.title}</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-semibold">Input your data</p>
                <p className="text-sm text-muted-foreground">Paste your text, upload your file, or select the options required for the tool.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-semibold">Process</p>
                <p className="text-sm text-muted-foreground">The tool will automatically process your input in real-time or after you click the action button.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-semibold">Get result</p>
                <p className="text-sm text-muted-foreground">Copy the result to your clipboard or download the processed file directly to your device.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-1">Is this tool free to use?</h3>
              <p className="text-sm text-muted-foreground">Yes, all tools on ToolifyX are 100% free with no hidden costs or subscriptions.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-1">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground">Absolutely. We use client-side processing, meaning your data never leaves your browser.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Do I need to install anything?</h3>
              <p className="text-sm text-muted-foreground">No installation required. Everything runs directly in your modern web browser.</p>
            </div>
          </div>
        </section>
      </div>

      {allRelatedTools.length > 0 && (
        <section className="space-y-6 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Explore More Tools</h2>
            <Link href="/" className="text-primary hover:underline text-sm font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRelatedTools.map((related) => (
              <ToolCard key={related.slug} tool={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
