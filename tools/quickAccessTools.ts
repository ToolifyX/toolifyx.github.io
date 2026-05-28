/**
 * Quick access tools displayed in the top navigation bar
 * Limited to 6 tools for optimal UX and performance
 */

export interface QuickAccessTool {
  slug: string;
  title: string;
  route: string;
}

export const QUICK_ACCESS_TOOLS: QuickAccessTool[] = [
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    route: '/tools/image-compressor',
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    route: '/tools/image-resizer',
  },
  {
    slug: 'image-crop',
    title: 'Image Cropper',
    route: '/tools/image-crop',
  },
  {
    slug: 'convert-to-jpg',
    title: 'Convert to JPG',
    route: '/tools/convert-to-jpg',
  },
  {
    slug: 'pdf-merge',
    title: 'PDF Merge',
    route: '/tools/pdf-merge',
  },
  {
    slug: 'pdf-split',
    title: 'PDF Split',
    route: '/tools/pdf-split',
  },
];

