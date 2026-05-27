import { tools, getToolBySlug } from '@/tools/config';
import { seoData } from '@/tools/seo';
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
    .slice(0, 4);

  const differentCategoryTools = tools
    .filter((t) => t.category !== tool.category)
    .slice(0, 2);

  const allRelatedTools = [...sameCategoryTools, ...differentCategoryTools];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (seo?.faqs || [
      { q: "Is this tool free to use?", a: "Yes, all tools on ToolifyX are 100% free with no hidden costs or subscriptions." },
      { q: "Is my data secure?", a: "Absolutely. We use client-side processing, meaning your data never leaves your browser." },
      { q: "Do I need to install anything?", a: "No installation required. Everything runs directly in your modern web browser." }
    ]).map(faq => ({
      "@type": "Question",
      "name": "question" in faq ? faq.question : (faq as any).q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "answer" in faq ? faq.answer : (faq as any).a
      }
    }))
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
            <Link href={`/${tool.category}-tools`} className="hover:text-foreground transition-colors">
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
            {(seo?.howToUse || [
              "Input your data: Paste your text, upload your file, or select the options required for the tool.",
              "Process: The tool will automatically process your input in real-time or after you click the action button.",
              "Get result: Copy the result to your clipboard or download the processed file directly to your device."
            ]).map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{i + 1}</span>
                <div>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {(seo?.faqs || [
              { question: "Is this tool free to use?", answer: "Yes, all tools on ToolifyX are 100% free with no hidden costs or subscriptions." },
              { question: "Is my data secure?", answer: "Absolutely. We use client-side processing, meaning your data never leaves your browser." },
              { question: "Do I need to install anything?", answer: "No installation required. Everything runs directly in your modern web browser." }
            ]).map((faq, i) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <h3 className="font-semibold mb-1">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-muted/30 p-8 rounded-2xl border space-y-4">
        <h2 className="text-2xl font-bold">About {tool.title}</h2>
        <p className="text-muted-foreground">
          {tool.title} is part of our extensive collection of <Link href={`/${tool.category}-tools`} className="text-primary font-medium hover:underline">{tool.category} tools</Link>.
          Like all utilities on ToolifyX, this tool is designed to be fast, private, and easy to use.
          Everything is processed locally on your machine using standard browser technologies, ensuring your sensitive information is never sent over the internet.
        </p>
        <p className="text-muted-foreground">
          Looking for something else? Browse our <Link href="/" className="text-primary font-medium hover:underline">full library of 50+ tools</Link> to find the right utility for your next task.
        </p>
      </section>

      {allRelatedTools.length > 0 && (
        <section className="space-y-6 pt-8 border-t">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Explore More Tools</h2>
            <Link href={`/${tool.category}-tools`} className="text-primary hover:underline text-sm font-medium">
              View all {tool.category} tools
            </Link>
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
