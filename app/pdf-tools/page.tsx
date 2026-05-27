import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Tools - Merge, Split, and Convert PDF Files Online',
  description: 'Free, secure, and fast PDF tools. Manage your PDF documents directly in your browser with our collection of specialized utilities.',
};

export default function PdfToolsPage() {
  return (
    <CategoryPage
      category="pdf"
      title="PDF Tools"
      description="Manage your PDF documents with ease using our secure, client-side PDF utilities. Our tools allow you to perform essential tasks like merging multiple documents into one, splitting large files into individual pages, and converting images to PDF format—all without ever uploading your files to a remote server. We prioritize your privacy and data security by utilizing powerful browser-based libraries. From rotating pages to viewing metadata, our PDF suite provides the essential features you need for daily document management in a fast, reliable, and completely free environment."
    />
  );
}
