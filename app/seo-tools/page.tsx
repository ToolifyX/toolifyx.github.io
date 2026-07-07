import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Tools - Professional Search Optimization Utilities',
  description: 'A suite of professional SEO tools to optimize your website content. Generate robots.txt, meta tags, schemas, and analyze keyword density locally in your browser.',
};

export default function SeoToolsPage() {
  return (
    <CategoryPage
      category="seo"
      title="SEO Tools"
      description="Elevate your website's search engine performance with our professional SEO toolkit. Designed for developers, marketers, and bloggers, these tools help you manage technical SEO essentials without ever sending your data to a server. From generating valid robots.txt files and JSON-LD schemas to previewing how your pages appear in Google search and social media, every utility runs entirely in your browser. Ensure your content structure is perfect with our heading analyzers and keyword density checkers, all while maintaining 100% privacy."
    />
  );
}
