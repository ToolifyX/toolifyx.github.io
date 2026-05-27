import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Tools - Color Pickers, Gradients, and Shadow Generators',
  description: 'Free online tools for UI/UX designers. Generate CSS gradients, box shadows, and color palettes with our easy-to-use design utilities.',
};

export default function DesignToolsPage() {
  return (
    <CategoryPage
      category="design"
      title="Design Tools"
      description="Elevate your UI/UX design workflow with our collection of specialized design utilities. We offer a range of tools to help you create beautiful and accessible interfaces. Explore our color pickers and random palette generators to find the perfect scheme for your next project. Use our CSS generators to design complex box shadows, gradients, and rounded corners with live previews and ready-to-use code snippets. We also include a WCAG-compliant contrast checker to ensure your designs are accessible to everyone. Our design tools are built for speed and ease of use, providing instant results right in your browser."
    />
  );
}
