import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Tools - Free Online Image Utilities',
  description: 'A collection of free, browser-based image tools. Compress, convert, resize, and edit your images instantly without uploading to any server.',
};

export default function ImageToolsPage() {
  return (
    <CategoryPage
      category="image"
      title="Image Tools"
      description="Welcome to our comprehensive suite of image manipulation tools. Designed for speed and privacy, every tool here runs entirely in your web browser. This means your sensitive photos and designs never leave your device. Whether you need to compress large files for web performance, convert between formats like PNG, JPG, and WebP, or perform quick edits like resizing and cropping, we've got you covered. Our tools use advanced browser APIs to ensure high-quality results without the need for expensive software or slow server-side processing."
    />
  );
}
