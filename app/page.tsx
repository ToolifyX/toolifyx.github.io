import { tools } from '@/tools/config';
import ToolCard from '@/components/ToolCard';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Every Tool You Need, <span className="text-primary">In One Place.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Fast, browser-based tools for everyday tasks. No login required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
