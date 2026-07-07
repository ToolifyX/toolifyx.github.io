import { Tool } from './types';

export const tools: Tool[] = [
  // Developer Tools
  { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format and beautify JSON instantly.', component: 'JsonFormatter', category: 'dev', icon: 'Braces', iconColor: 'text-blue-500 bg-blue-500/10', themeColor: 'blue' },
  { slug: 'json-validator', title: 'JSON Validator', description: 'Check your JSON syntax and validate.', component: 'JsonValidator', category: 'dev', icon: 'ShieldCheck', iconColor: 'text-indigo-500 bg-indigo-500/10', themeColor: 'indigo' },
  { slug: 'base64-tool', title: 'Base64 Tool', description: 'Encode/Decode text to Base64 format.', component: 'Base64Tool', category: 'dev', icon: 'Binary', iconColor: 'text-cyan-500 bg-cyan-500/10', themeColor: 'cyan' },
  { slug: 'url-tool', title: 'URL Tool', description: 'Encode/Decode URLs and parameters.', component: 'UrlTool', category: 'dev', icon: 'Link', iconColor: 'text-sky-500 bg-sky-500/10', themeColor: 'sky' },
  { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate secure Version 4 UUIDs.', component: 'UuidGenerator', category: 'dev', icon: 'Fingerprint', iconColor: 'text-violet-500 bg-violet-500/10', themeColor: 'violet' },
  { slug: 'sha256-generator', title: 'SHA-256 Generator', description: 'Generate secure SHA-256 hashes.', component: 'Sha256Generator', category: 'dev', icon: 'Lock', iconColor: 'text-slate-500 bg-slate-500/10', themeColor: 'slate' },
  { slug: 'regex-tester', title: 'Regex Tester', description: 'Test regular expressions in real-time.', component: 'RegexTester', category: 'dev', icon: 'SearchCode', iconColor: 'text-blue-600 bg-blue-600/10', themeColor: 'blue' },
  { slug: 'timestamp-converter', title: 'Timestamp Converter', description: 'Unix timestamp to date and vice versa.', component: 'TimestampConverter', category: 'dev', icon: 'Clock', iconColor: 'text-indigo-600 bg-indigo-600/10', themeColor: 'indigo' },
  { slug: 'html-minifier', title: 'HTML Minifier', description: 'Compress HTML by removing whitespace.', component: 'HtmlMinifier', category: 'dev', icon: 'Code', iconColor: 'text-orange-500 bg-orange-500/10', themeColor: 'orange' },
  { slug: 'css-minifier', title: 'CSS Minifier', description: 'Minify CSS stylesheets instantly.', component: 'CssMinifier', category: 'dev', icon: 'Palette', iconColor: 'text-blue-400 bg-blue-400/10', themeColor: 'blue' },

  // Text Tools
  { slug: 'word-counter', title: 'Word Counter', description: 'Count words, chars, and sentences.', component: 'WordCounter', category: 'text', icon: 'FileText', iconColor: 'text-orange-600 bg-orange-600/10', themeColor: 'orange' },
  { slug: 'case-converter', title: 'Case Converter', description: 'Convert text to UPPER, lower, etc.', component: 'CaseConverter', category: 'text', icon: 'Baseline', iconColor: 'text-amber-500 bg-amber-500/10', themeColor: 'amber' },
  { slug: 'slug-generator', title: 'Slug Generator', description: 'Create SEO-friendly URL slugs.', component: 'SlugGenerator', category: 'text', icon: 'Type', iconColor: 'text-yellow-600 bg-yellow-600/10', themeColor: 'yellow' },
  { slug: 'space-remover', title: 'Space Remover', description: 'Remove extra spaces and empty lines.', component: 'SpaceRemover', category: 'text', icon: 'Eraser', iconColor: 'text-red-400 bg-red-400/10', themeColor: 'red' },
  { slug: 'text-sorter', title: 'Text Sorter', description: 'Sort lines alphabetically (A-Z, Z-A).', component: 'TextSorter', category: 'text', icon: 'SortAsc', iconColor: 'text-orange-400 bg-orange-400/10', themeColor: 'orange' },
  { slug: 'duplicate-remover', title: 'Duplicate Remover', description: 'Strip duplicate lines from your list.', component: 'DuplicateRemover', category: 'text', icon: 'Copy', iconColor: 'text-orange-500 bg-orange-500/10', themeColor: 'orange' },
  { slug: 'text-reverser', title: 'Text Reverser', description: 'Reverse entire text or flip lines.', component: 'TextReverser', category: 'text', icon: 'RotateCcw', iconColor: 'text-amber-600 bg-amber-600/10', themeColor: 'amber' },
  { slug: 'character-counter', title: 'Character Counter', description: 'Count characters with/without spaces.', component: 'CharacterCounter', category: 'text', icon: 'Hash', iconColor: 'text-yellow-500 bg-yellow-500/10', themeColor: 'yellow' },
  { slug: 'random-text-generator', title: 'Random Text Generator', description: 'Generate random strings for testing.', component: 'RandomTextGenerator', category: 'text', icon: 'Shuffle', iconColor: 'text-orange-300 bg-orange-300/10', themeColor: 'orange' },
  { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', component: 'LoremIpsumGenerator', category: 'text', icon: 'Text', iconColor: 'text-amber-400 bg-amber-400/10', themeColor: 'amber' },

  // Image Tools
  { slug: 'image-compressor', title: 'Image Compressor', description: 'Reduce image file size instantly.', component: 'ImageCompressor', category: 'image', icon: 'Minimize2', iconColor: 'text-green-500 bg-green-500/10', themeColor: 'green' },
  { slug: 'convert-to-png', title: 'Convert to PNG', description: 'Convert JPG, WebP, SVG and more to PNG format instantly.', component: 'ConvertToPng', category: 'image', icon: 'RefreshCw', iconColor: 'text-emerald-500 bg-emerald-500/10', themeColor: 'emerald' },
  { slug: 'convert-to-jpg', title: 'Convert to JPG', description: 'Convert PNG, WebP, HEIC, AVIF and more to JPG format instantly.', component: 'ConvertToJpg', category: 'image', icon: 'RefreshCw', iconColor: 'text-teal-500 bg-teal-500/10', themeColor: 'teal' },
  { slug: 'convert-to-webp', title: 'Convert to WebP', description: 'Convert JPG, PNG and more to WebP format instantly.', component: 'ConvertToWebp', category: 'image', icon: 'RefreshCw', iconColor: 'text-green-600 bg-green-600/10', themeColor: 'green' },
  { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimensions.', component: 'ImageResizer', category: 'image', icon: 'Maximize', iconColor: 'text-emerald-600 bg-emerald-600/10', themeColor: 'emerald' },
  { slug: 'image-editor', title: 'Image Editor', description: 'Rotate, flip, and edit images.', component: 'ImageEditor', category: 'image', icon: 'Edit3', iconColor: 'text-teal-600 bg-teal-600/10', themeColor: 'teal' },
  { slug: 'image-crop', title: 'Image Cropper', description: 'Crop images to any size and ratio.', component: 'ImageCropTool', category: 'image', icon: 'Crop', iconColor: 'text-green-400 bg-green-400/10', themeColor: 'green' },
  { slug: 'image-base64', title: 'Image to Base64', description: 'Convert images to Base64 strings.', component: 'ImageBase64Tool', category: 'image', icon: 'FileCode', iconColor: 'text-emerald-400 bg-emerald-400/10', themeColor: 'emerald' },
  { slug: 'image-metadata', title: 'Image Metadata', description: 'View and remove image EXIF data.', component: 'ImageMetadataTool', category: 'image', icon: 'Info', iconColor: 'text-teal-400 bg-teal-400/10', themeColor: 'teal' },
  { slug: 'image-color-tool', title: 'Image Color Tool', description: 'Extract colors and grayscale.', component: 'ImageColorTool', category: 'image', icon: 'Pipette', iconColor: 'text-green-700 bg-green-700/10', themeColor: 'green' },
  { slug: 'thumbnail-generator', title: 'Thumbnail Generator', description: 'Create custom image thumbnails.', component: 'ThumbnailGenerator', category: 'image', icon: 'Image', iconColor: 'text-emerald-700 bg-emerald-700/10', themeColor: 'emerald' },
  { slug: 'blur-detector', title: 'Blur Detector', description: 'Check image sharpness and blur.', component: 'BlurDetector', category: 'image', icon: 'EyeOff', iconColor: 'text-teal-700 bg-teal-700/10', themeColor: 'teal' },

  // PDF Tools
  { slug: 'pdf-merge', title: 'PDF Merge', description: 'Combine multiple PDFs into one.', component: 'PdfMergeTool', category: 'pdf', icon: 'Combine', iconColor: 'text-red-500 bg-red-500/10', themeColor: 'red' },
  { slug: 'pdf-split', title: 'PDF Split', description: 'Split or extract pages from PDF.', component: 'PdfSplitTool', category: 'pdf', icon: 'Scissors', iconColor: 'text-rose-500 bg-rose-500/10', themeColor: 'rose' },
  { slug: 'image-to-pdf', title: 'Image to PDF', description: 'Convert JPG/PNG images to PDF.', component: 'ImageToPdf', category: 'pdf', icon: 'FileImage', iconColor: 'text-red-600 bg-red-600/10', themeColor: 'red' },
  { slug: 'pdf-metadata', title: 'PDF Metadata', description: 'View PDF info and page count.', component: 'PdfMetadataTool', category: 'pdf', icon: 'FileSearch', iconColor: 'text-rose-600 bg-rose-600/10', themeColor: 'rose' },
  { slug: 'pdf-rotate', title: 'PDF Rotate', description: 'Rotate all pages in a PDF file.', component: 'PdfRotateTool', category: 'pdf', icon: 'RotateCw', iconColor: 'text-red-400 bg-red-400/10', themeColor: 'red' },
  { slug: 'pdf-compress', title: 'PDF Compress', description: 'Reduce PDF file size securely.', component: 'PdfCompressTool', category: 'pdf', icon: 'Shrink', iconColor: 'text-rose-400 bg-rose-400/10', themeColor: 'rose' },
  { slug: 'pdf-editor', title: 'PDF Editor', description: 'Edit PDF text and annotations locally.', component: 'PdfEditor', category: 'pdf', icon: 'Edit3', iconColor: 'text-red-700 bg-red-700/10', themeColor: 'red' },

  // Design Tools
  { slug: 'color-picker', title: 'Color Picker', description: 'Pick colors and get HEX/RGB values.', component: 'ColorPicker', category: 'design', icon: 'MousePointer2', iconColor: 'text-purple-500 bg-purple-500/10', themeColor: 'purple' },
  { slug: 'gradient-generator', title: 'Gradient Generator', description: 'Design custom CSS linear gradients.', component: 'GradientGenerator', category: 'design', icon: 'Layers', iconColor: 'text-pink-500 bg-pink-500/10', themeColor: 'pink' },
  { slug: 'box-shadow-generator', title: 'Box Shadow Generator', description: 'Create custom CSS box shadows.', component: 'BoxShadowGenerator', category: 'design', icon: 'Shadow', iconColor: 'text-fuchsia-500 bg-fuchsia-500/10', themeColor: 'fuchsia' },
  { slug: 'border-radius-generator', title: 'Border Radius Generator', description: 'Create rounded corners for UI.', component: 'BorderRadiusGenerator', category: 'design', icon: 'Square', iconColor: 'text-purple-600 bg-purple-600/10', themeColor: 'purple' },
  { slug: 'color-palette-generator', title: 'Color Palette Generator', description: 'Generate random color schemes.', component: 'ColorPaletteGenerator', category: 'design', icon: 'Palette', iconColor: 'text-pink-600 bg-pink-600/10', themeColor: 'pink' },
  { slug: 'contrast-checker', title: 'Contrast Checker', description: 'Check WCAG contrast accessibility.', component: 'ContrastChecker', category: 'design', icon: 'SunMoon', iconColor: 'text-fuchsia-600 bg-fuchsia-600/10', themeColor: 'fuchsia' },
  { slug: 'font-preview', title: 'Font Preview Tool', description: 'Preview text with different fonts.', component: 'FontPreviewTool', category: 'design', icon: 'Type', iconColor: 'text-purple-400 bg-purple-400/10', themeColor: 'purple' },

  // Utility Tools
  { slug: 'qr-code-generator', title: 'QR Code Generator', description: 'Generate custom QR codes instantly.', component: 'QrCodeGenerator', category: 'utility', icon: 'QrCode', iconColor: 'text-blue-900 bg-blue-900/10', themeColor: 'slate' },
  { slug: 'password-generator', title: 'Password Generator', description: 'Create strong, secure passwords.', component: 'PasswordGenerator', category: 'utility', icon: 'Key', iconColor: 'text-slate-700 bg-slate-700/10', themeColor: 'slate' },
  { slug: 'unit-converter', title: 'Unit Converter', description: 'Convert length and weight units.', component: 'UnitConverter', category: 'utility', icon: 'Ruler', iconColor: 'text-zinc-600 bg-zinc-600/10', themeColor: 'zinc' },
  { slug: 'percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages and changes.', component: 'PercentageCalculator', category: 'utility', icon: 'Percent', iconColor: 'text-neutral-500 bg-neutral-500/10', themeColor: 'neutral' },
];

export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
