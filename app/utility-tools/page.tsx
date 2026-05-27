import CategoryPage from '@/components/CategoryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Utility Tools - QR Code and Password Generators',
  description: 'Handy online utilities for everyday tasks. Generate QR codes, secure passwords, and convert units with our free and private web tools.',
};

export default function UtilityToolsPage() {
  return (
    <CategoryPage
      category="utility"
      title="Utility Tools"
      description="Discover a variety of helpful utilities for your everyday digital tasks. Our utility suite includes essential tools like a high-quality QR code generator for links and text, and a secure password generator to help you maintain your online safety. We also provide a versatile unit converter for length and weight, and a simple percentage calculator for quick math. Each utility is designed to be simple, fast, and entirely private. By processing all operations locally in your browser, we ensure that your data—from generated passwords to converted values—never leaves your device, giving you peace of mind and instant results."
    />
  );
}
