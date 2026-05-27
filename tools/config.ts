import { Tool } from './types';

export const tools: Tool[] = [
  // Developer Tools
  { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format and beautify JSON instantly.', component: 'JsonFormatter', category: 'dev' },
  { slug: 'json-validator', title: 'JSON Validator', description: 'Check your JSON syntax and validate.', component: 'JsonValidator', category: 'dev' },
  { slug: 'base64-tool', title: 'Base64 Tool', description: 'Encode/Decode text to Base64 format.', component: 'Base64Tool', category: 'dev' },
  { slug: 'url-tool', title: 'URL Tool', description: 'Encode/Decode URLs and parameters.', component: 'UrlTool', category: 'dev' },
  { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate secure Version 4 UUIDs.', component: 'UuidGenerator', category: 'dev' },
  { slug: 'sha256-generator', title: 'SHA-256 Generator', description: 'Generate secure SHA-256 hashes.', component: 'Sha256Generator', category: 'dev' },
  { slug: 'regex-tester', title: 'Regex Tester', description: 'Test regular expressions in real-time.', component: 'RegexTester', category: 'dev' },
  { slug: 'timestamp-converter', title: 'Timestamp Converter', description: 'Unix timestamp to date and vice versa.', component: 'TimestampConverter', category: 'dev' },
  { slug: 'html-minifier', title: 'HTML Minifier', description: 'Compress HTML by removing whitespace.', component: 'HtmlMinifier', category: 'dev' },
  { slug: 'css-minifier', title: 'CSS Minifier', description: 'Minify CSS stylesheets instantly.', component: 'CssMinifier', category: 'dev' },

  // Text Tools
  { slug: 'word-counter', title: 'Word Counter', description: 'Count words, chars, and sentences.', component: 'WordCounter', category: 'text' },
  { slug: 'case-converter', title: 'Case Converter', description: 'Convert text to UPPER, lower, etc.', component: 'CaseConverter', category: 'text' },
  { slug: 'slug-generator', title: 'Slug Generator', description: 'Create SEO-friendly URL slugs.', component: 'SlugGenerator', category: 'text' },
  { slug: 'space-remover', title: 'Space Remover', description: 'Remove extra spaces and empty lines.', component: 'SpaceRemover', category: 'text' },
  { slug: 'text-sorter', title: 'Text Sorter', description: 'Sort lines alphabetically (A-Z, Z-A).', component: 'TextSorter', category: 'text' },
  { slug: 'duplicate-remover', title: 'Duplicate Remover', description: 'Strip duplicate lines from your list.', component: 'DuplicateRemover', category: 'text' },
  { slug: 'text-reverser', title: 'Text Reverser', description: 'Reverse entire text or flip lines.', component: 'TextReverser', category: 'text' },
  { slug: 'character-counter', title: 'Character Counter', description: 'Count characters with/without spaces.', component: 'CharacterCounter', category: 'text' },
  { slug: 'random-text-generator', title: 'Random Text Generator', description: 'Generate random strings for testing.', component: 'RandomTextGenerator', category: 'text' },
  { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', component: 'LoremIpsumGenerator', category: 'text' },

  // Image Tools
  { slug: 'image-compressor', title: 'Image Compressor', description: 'Reduce image file size instantly.', component: 'ImageCompressor', category: 'image' },
  { slug: 'image-converter', title: 'Image Converter', description: 'Convert between JPG, PNG, and WebP.', component: 'ImageConverter', category: 'image' },
  { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimensions.', component: 'ImageResizer', category: 'image' },
  { slug: 'image-editor', title: 'Image Editor', description: 'Rotate, flip, and edit images.', component: 'ImageEditor', category: 'image' },
  { slug: 'image-base64', title: 'Image to Base64', description: 'Convert images to Base64 strings.', component: 'ImageBase64Tool', category: 'image' },
  { slug: 'image-metadata', title: 'Image Metadata', description: 'View and remove image EXIF data.', component: 'ImageMetadataTool', category: 'image' },
  { slug: 'image-color-tool', title: 'Image Color Tool', description: 'Extract colors and grayscale.', component: 'ImageColorTool', category: 'image' },
  { slug: 'thumbnail-generator', title: 'Thumbnail Generator', description: 'Create custom image thumbnails.', component: 'ThumbnailGenerator', category: 'image' },
  { slug: 'blur-detector', title: 'Blur Detector', description: 'Check image sharpness and blur.', component: 'BlurDetector', category: 'image' },

  // PDF Tools
  { slug: 'pdf-merge', title: 'PDF Merge', description: 'Combine multiple PDFs into one.', component: 'PdfMergeTool', category: 'pdf' },
  { slug: 'pdf-split', title: 'PDF Split', description: 'Split or extract pages from PDF.', component: 'PdfSplitTool', category: 'pdf' },
  { slug: 'image-to-pdf', title: 'Image to PDF', description: 'Convert JPG/PNG images to PDF.', component: 'ImageToPdf', category: 'pdf' },
  { slug: 'pdf-metadata', title: 'PDF Metadata', description: 'View PDF info and page count.', component: 'PdfMetadataTool', category: 'pdf' },
  { slug: 'pdf-rotate', title: 'PDF Rotate', description: 'Rotate all pages in a PDF file.', component: 'PdfRotateTool', category: 'pdf' },
  { slug: 'pdf-compress', title: 'PDF Compress', description: 'Reduce PDF file size securely.', component: 'PdfCompressTool', category: 'pdf' },

  // Design Tools
  { slug: 'color-picker', title: 'Color Picker', description: 'Pick colors and get HEX/RGB values.', component: 'ColorPicker', category: 'design' },
  { slug: 'gradient-generator', title: 'Gradient Generator', description: 'Design custom CSS linear gradients.', component: 'GradientGenerator', category: 'design' },
  { slug: 'box-shadow-generator', title: 'Box Shadow Generator', description: 'Create custom CSS box shadows.', component: 'BoxShadowGenerator', category: 'design' },
  { slug: 'border-radius-generator', title: 'Border Radius Generator', description: 'Create rounded corners for UI.', component: 'BorderRadiusGenerator', category: 'design' },
  { slug: 'color-palette-generator', title: 'Color Palette Generator', description: 'Generate random color schemes.', component: 'ColorPaletteGenerator', category: 'design' },
  { slug: 'contrast-checker', title: 'Contrast Checker', description: 'Check WCAG contrast accessibility.', component: 'ContrastChecker', category: 'design' },
  { slug: 'font-preview', title: 'Font Preview Tool', description: 'Preview text with different fonts.', component: 'FontPreviewTool', category: 'design' },

  // Utility Tools
  { slug: 'qr-code-generator', title: 'QR Code Generator', description: 'Generate custom QR codes instantly.', component: 'QrCodeGenerator', category: 'utility' },
  { slug: 'password-generator', title: 'Password Generator', description: 'Create strong, secure passwords.', component: 'PasswordGenerator', category: 'utility' },
  { slug: 'unit-converter', title: 'Unit Converter', description: 'Convert length and weight units.', component: 'UnitConverter', category: 'utility' },
  { slug: 'percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages and changes.', component: 'PercentageCalculator', category: 'utility' },
];

export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
