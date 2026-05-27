import { Tool } from './types';

export const tools: Tool[] = [
  // Developer Tools
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and beautify JSON instantly with custom indentation.',
    component: 'JsonFormatter',
    category: 'dev',
  },
  {
    slug: 'json-validator',
    title: 'JSON Validator',
    description: 'Check your JSON syntax and validate against RFC 8259.',
    component: 'JsonValidator',
    category: 'dev',
  },
  {
    slug: 'base64-tool',
    title: 'Base64 Encoder/Decoder',
    description: 'Easily encode and decode text to/from Base64 format.',
    component: 'Base64Tool',
    category: 'dev',
  },
  {
    slug: 'url-tool',
    title: 'URL Encoder/Decoder',
    description: 'Safely encode or decode URLs and parameters.',
    component: 'UrlTool',
    category: 'dev',
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate secure, random Version 4 UUIDs instantly.',
    component: 'UuidGenerator',
    category: 'dev',
  },
  {
    slug: 'sha256-generator',
    title: 'SHA-256 Generator',
    description: 'Generate secure SHA-256 cryptographic hashes from text.',
    component: 'Sha256Generator',
    category: 'dev',
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time highlighting.',
    component: 'RegexTester',
    category: 'dev',
  },
  {
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human dates and vice versa.',
    component: 'TimestampConverter',
    category: 'dev',
  },
  {
    slug: 'html-minifier',
    title: 'HTML Minifier',
    description: 'Compress HTML code by removing comments and whitespace.',
    component: 'HtmlMinifier',
    category: 'dev',
  },
  {
    slug: 'css-minifier',
    title: 'CSS Minifier',
    description: 'Minify CSS stylesheets to improve website loading speed.',
    component: 'CssMinifier',
    category: 'dev',
  },

  // Text Tools
  {
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, and sentences instantly.',
    component: 'WordCounter',
    category: 'text',
  },
  {
    slug: 'case-converter',
    title: 'Text Case Converter',
    description: 'Convert text to UPPERCASE, lowercase, and more.',
    component: 'CaseConverter',
    category: 'text',
  },
  {
    slug: 'slug-generator',
    title: 'Slug Generator',
    description: 'Convert any text into a URL-friendly slug.',
    component: 'SlugGenerator',
    category: 'text',
  },
  {
    slug: 'space-remover',
    title: 'Remove Extra Spaces',
    description: 'Clean up text by removing extra spaces and empty lines.',
    component: 'SpaceRemover',
    category: 'text',
  },
  {
    slug: 'text-sorter',
    title: 'Text Sorter',
    description: 'Sort lines of text alphabetically (A-Z or Z-A).',
    component: 'TextSorter',
    category: 'text',
  },
  {
    slug: 'duplicate-remover',
    title: 'Remove Duplicate Lines',
    description: 'Strip duplicate lines from your list while keeping order.',
    component: 'DuplicateRemover',
    category: 'text',
  },
  {
    slug: 'text-reverser',
    title: 'Text Reverser',
    description: 'Reverse entire text or flip each line individually.',
    component: 'TextReverser',
    category: 'text',
  },
  {
    slug: 'character-counter',
    title: 'Character Counter',
    description: 'Count characters with and without spaces.',
    component: 'CharacterCounter',
    category: 'text',
  },
  {
    slug: 'random-text-generator',
    title: 'Random Text Generator',
    description: 'Generate secure random strings for passwords or testing.',
    component: 'RandomTextGenerator',
    category: 'text',
  },
  {
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs and layouts.',
    component: 'LoremIpsumGenerator',
    category: 'text',
  },
];

export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
