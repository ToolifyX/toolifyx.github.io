import { tools, getToolBySlug } from '@/tools/config';
import ToolRenderer from '@/components/ToolRenderer';
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">Home</Link>
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
        <h1 className="text-3xl font-bold tracking-tight">{tool.title}</h1>
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

      <div className="prose prose-sm max-w-none text-muted-foreground">
        <h3>About {tool.title}</h3>
        <p>
          This is a free, browser-based tool. No data is sent to our servers; everything is processed locally in your browser for maximum privacy and speed.
        </p>
      </div>
    </div>
  );
}
