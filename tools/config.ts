import { Tool } from './types';

export const tools: Tool[] = [
  // Developer Tools
  { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format and beautify JSON instantly.', component: 'JsonFormatter', category: 'dev', icon: 'Braces' },
  { slug: 'json-validator', title: 'JSON Validator', description: 'Check your JSON syntax and validate.', component: 'JsonValidator', category: 'dev', icon: 'ShieldCheck' },
  { slug: 'base64-tool', title: 'Base64 Tool', description: 'Encode/Decode text to Base64 format.', component: 'Base64Tool', category: 'dev', icon: 'Binary' },
  { slug: 'url-tool', title: 'URL Tool', description: 'Encode/Decode URLs and parameters.', component: 'UrlTool', category: 'dev', icon: 'Link' },
  { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate secure Version 4 UUIDs.', component: 'UuidGenerator', category: 'dev', icon: 'Fingerprint' },
  { slug: 'sha256-generator', title: 'SHA-256 Generator', description: 'Generate secure SHA-256 hashes.', component: 'Sha256Generator', category: 'dev', icon: 'Lock' },
  { slug: 'regex-tester', title: 'Regex Tester', description: 'Test regular expressions in real-time.', component: 'RegexTester', category: 'dev', icon: 'SearchCode' },
  { slug: 'timestamp-converter', title: 'Timestamp Converter', description: 'Unix timestamp to date and vice versa.', component: 'TimestampConverter', category: 'dev', icon: 'Clock' },
  { slug: 'html-minifier', title: 'HTML Minifier', description: 'Compress HTML by removing whitespace.', component: 'HtmlMinifier', category: 'dev', icon: 'Code' },
  { slug: 'css-minifier', title: 'CSS Minifier', description: 'Minify CSS stylesheets instantly.', component: 'CssMinifier', category: 'dev', icon: 'Palette' },

  // Text Tools
  { slug: 'word-counter', title: 'Word Counter', description: 'Count words, chars, and sentences.', component: 'WordCounter', category: 'text', icon: 'FileText' },
  { slug: 'case-converter', title: 'Case Converter', description: 'Convert text to UPPER, lower, etc.', component: 'CaseConverter', category: 'text', icon: 'Baseline' },
  { slug: 'slug-generator', title: 'Slug Generator', description: 'Create SEO-friendly URL slugs.', component: 'SlugGenerator', category: 'text', icon: 'Type' },
  { slug: 'space-remover', title: 'Space Remover', description: 'Remove extra spaces and empty lines.', component: 'SpaceRemover', category: 'text', icon: 'Eraser' },
  { slug: 'text-sorter', title: 'Text Sorter', description: 'Sort lines alphabetically (A-Z, Z-A).', component: 'TextSorter', category: 'text', icon: 'SortAsc' },
  { slug: 'duplicate-remover', title: 'Duplicate Remover', description: 'Strip duplicate lines from your list.', component: 'DuplicateRemover', category: 'text', icon: 'Copy' },
  { slug: 'text-reverser', title: 'Text Reverser', description: 'Reverse entire text or flip lines.', component: 'TextReverser', category: 'text', icon: 'RotateCcw' },
  { slug: 'character-counter', title: 'Character Counter', description: 'Count characters with/without spaces.', component: 'CharacterCounter', category: 'text', icon: 'Hash' },
  { slug: 'random-text-generator', title: 'Random Text Generator', description: 'Generate random strings for testing.', component: 'RandomTextGenerator', category: 'text', icon: 'Shuffle' },
  { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', component: 'LoremIpsumGenerator', category: 'text', icon: 'Text' },

  // Image Tools
  { slug: 'image-compressor', title: 'Image Compressor', description: 'Reduce image file size instantly.', component: 'ImageCompressor', category: 'image', icon: 'Minimize2' },
  { slug: 'png-to-jpg', title: 'PNG to JPG', description: 'Convert PNG images to JPG instantly in your browser. No upload required.', component: 'PngToJpg', category: 'image', icon: 'RefreshCw' },
  { slug: 'jpg-to-png', title: 'JPG to PNG', description: 'Convert JPG images to PNG instantly in your browser. No upload required.', component: 'JpgToPng', category: 'image', icon: 'RefreshCw' },
  { slug: 'jpg-to-webp', title: 'JPG to WebP', description: 'Convert JPG images to WebP format instantly in your browser. No upload required.', component: 'JpgToWebp', category: 'image', icon: 'RefreshCw' },
  { slug: 'webp-to-jpg', title: 'WebP to JPG', description: 'Convert WebP images to JPG format instantly in your browser. No upload required.', component: 'WebpToJpg', category: 'image', icon: 'RefreshCw' },
  { slug: 'png-to-webp', title: 'PNG to WebP', description: 'Convert PNG images to WebP format instantly in your browser. No upload required.', component: 'PngToWebp', category: 'image', icon: 'RefreshCw' },
  { slug: 'webp-to-png', title: 'WebP to PNG', description: 'Convert WebP images to PNG format instantly in your browser. No upload required.', component: 'WebpToPng', category: 'image', icon: 'RefreshCw' },
  { slug: 'heic-to-jpg', title: 'HEIC to JPG', description: 'Convert HEIC images to JPG format instantly in your browser. No upload required.', component: 'HeicToJpg', category: 'image', icon: 'RefreshCw' },
  { slug: 'avif-to-jpg', title: 'AVIF to JPG', description: 'Convert AVIF images to JPG format instantly in your browser. No upload required.', component: 'AvifToJpg', category: 'image', icon: 'RefreshCw' },
  { slug: 'svg-to-png', title: 'SVG to PNG', description: 'Convert SVG images to PNG format instantly in your browser. No upload required.', component: 'SvgToPng', category: 'image', icon: 'RefreshCw' },
  { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimensions.', component: 'ImageResizer', category: 'image', icon: 'Maximize' },
  { slug: 'image-editor', title: 'Image Editor', description: 'Rotate, flip, and edit images.', component: 'ImageEditor', category: 'image', icon: 'Edit3' },
  { slug: 'image-base64', title: 'Image to Base64', description: 'Convert images to Base64 strings.', component: 'ImageBase64Tool', category: 'image', icon: 'FileCode' },
  { slug: 'image-metadata', title: 'Image Metadata', description: 'View and remove image EXIF data.', component: 'ImageMetadataTool', category: 'image', icon: 'Info' },
  { slug: 'image-color-tool', title: 'Image Color Tool', description: 'Extract colors and grayscale.', component: 'ImageColorTool', category: 'image', icon: 'Pipette' },
  { slug: 'thumbnail-generator', title: 'Thumbnail Generator', description: 'Create custom image thumbnails.', component: 'ThumbnailGenerator', category: 'image', icon: 'Image' },
  { slug: 'blur-detector', title: 'Blur Detector', description: 'Check image sharpness and blur.', component: 'BlurDetector', category: 'image', icon: 'EyeOff' },
  { slug: 'image-crop', title: 'Image Cropper', description: 'Crop images with free or fixed aspect ratios.', component: 'ImageCropTool', category: 'image', icon: 'Crop' },

  // PDF Tools
  { slug: 'pdf-merge', title: 'PDF Merge', description: 'Combine multiple PDFs into one.', component: 'PdfMergeTool', category: 'pdf', icon: 'Combine' },
  { slug: 'pdf-split', title: 'PDF Split', description: 'Split or extract pages from PDF.', component: 'PdfSplitTool', category: 'pdf', icon: 'Scissors' },
  { slug: 'image-to-pdf', title: 'Image to PDF', description: 'Convert JPG/PNG images to PDF.', component: 'ImageToPdf', category: 'pdf', icon: 'FileImage' },
  { slug: 'pdf-metadata', title: 'PDF Metadata', description: 'View PDF info and page count.', component: 'PdfMetadataTool', category: 'pdf', icon: 'FileSearch' },
  { slug: 'pdf-rotate', title: 'PDF Rotate', description: 'Rotate all pages in a PDF file.', component: 'PdfRotateTool', category: 'pdf', icon: 'RotateCw' },
  { slug: 'pdf-compress', title: 'PDF Compress', description: 'Reduce PDF file size securely.', component: 'PdfCompressTool', category: 'pdf', icon: 'Shrink' },

  // Design Tools
  { slug: 'color-picker', title: 'Color Picker', description: 'Pick colors and get HEX/RGB values.', component: 'ColorPicker', category: 'design', icon: 'MousePointer2' },
  { slug: 'gradient-generator', title: 'Gradient Generator', description: 'Design custom CSS linear gradients.', component: 'GradientGenerator', category: 'design', icon: 'Layers' },
  { slug: 'box-shadow-generator', title: 'Box Shadow Generator', description: 'Create custom CSS box shadows.', component: 'BoxShadowGenerator', category: 'design', icon: 'Shadow' },
  { slug: 'border-radius-generator', title: 'Border Radius Generator', description: 'Create rounded corners for UI.', component: 'BorderRadiusGenerator', category: 'design', icon: 'Square' },
  { slug: 'color-palette-generator', title: 'Color Palette Generator', description: 'Generate random color schemes.', component: 'ColorPaletteGenerator', category: 'design', icon: 'Palette' },
  { slug: 'contrast-checker', title: 'Contrast Checker', description: 'Check WCAG contrast accessibility.', component: 'ContrastChecker', category: 'design', icon: 'SunMoon' },
  { slug: 'font-preview', title: 'Font Preview Tool', description: 'Preview text with different fonts.', component: 'FontPreviewTool', category: 'design', icon: 'Type' },

  // Utility Tools
  { slug: 'qr-code-generator', title: 'QR Code Generator', description: 'Generate custom QR codes instantly.', component: 'QrCodeGenerator', category: 'utility', icon: 'QrCode' },
  { slug: 'password-generator', title: 'Password Generator', description: 'Create strong, secure passwords.', component: 'PasswordGenerator', category: 'utility', icon: 'Key' },
  { slug: 'unit-converter', title: 'Unit Converter', description: 'Convert length and weight units.', component: 'UnitConverter', category: 'utility', icon: 'Ruler' },
  { slug: 'percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages and changes.', component: 'PercentageCalculator', category: 'utility', icon: 'Percent' },
];

export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
