import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Tools - JSON, Base64, and Regex Utilities',
  description: 'Essential online tools for developers. Format JSON, generate UUIDs, test regex, and more with our fast and secure web-based utilities.',
};

export default function DevToolsPage() {
  return (
    <CategoryPage
      category="dev"
      title="Developer Tools"
      description="Boost your productivity with our set of essential developer utilities. We understand that developers need reliable, quick, and secure tools for daily tasks. Our collection includes high-performance JSON formatters and validators, Base64 and URL encoders, and robust regex testers. Every tool is built with a focus on privacy—your code, data, and configurations stay in your browser. Whether you're generating secure UUIDs, hashing strings with SHA-256, or minifying HTML and CSS for production, our tools provide the precision and speed required for modern software development workflows."
    />
  );
}
