import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Tools - Word Counter, Case Converter, and Generators',
  description: 'Clean, convert, and generate text with our free online tools. From word counting to Lorem Ipsum generation, all your text needs in one place.',
};

export default function TextToolsPage() {
  return (
    <CategoryPage
      category="text"
      title="Text Tools"
      description="Refine and transform your text content with our versatile suite of text manipulation utilities. Whether you're a writer, editor, or student, our tools help you clean up messy data, convert cases, and analyze text structure in seconds. Count words and characters with precision, generate URL-friendly slugs, or sort large lists alphabetically. We also provide handy generators for Lorem Ipsum placeholder text and random strings. Like all ToolifyX utilities, these text tools process your data locally, ensuring that your content remains private while giving you the speed of a native application."
    />
  );
}
