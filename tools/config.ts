import { Tool } from './types';

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and beautify JSON instantly with custom indentation.',
    component: 'JsonFormatter',
    category: 'Developer',
  },
  {
    slug: 'json-validator',
    title: 'JSON Validator',
    description: 'Check your JSON syntax and validate against RFC 8259.',
    component: 'JsonValidator',
    category: 'Developer',
  },
  {
    slug: 'base64-tool',
    title: 'Base64 Encoder/Decoder',
    description: 'Easily encode and decode text to/from Base64 format.',
    component: 'Base64Tool',
    category: 'Developer',
  },
  {
    slug: 'url-tool',
    title: 'URL Encoder/Decoder',
    description: 'Safely encode or decode URLs and parameters.',
    component: 'UrlTool',
    category: 'Developer',
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate secure, random Version 4 UUIDs instantly.',
    component: 'UuidGenerator',
    category: 'Developer',
  },
  {
    slug: 'sha256-generator',
    title: 'SHA-256 Generator',
    description: 'Generate secure SHA-256 cryptographic hashes from text.',
    component: 'Sha256Generator',
    category: 'Developer',
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time highlighting.',
    component: 'RegexTester',
    category: 'Developer',
  },
  {
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human dates and vice versa.',
    component: 'TimestampConverter',
    category: 'Developer',
  },
  {
    slug: 'html-minifier',
    title: 'HTML Minifier',
    description: 'Compress HTML code by removing comments and whitespace.',
    component: 'HtmlMinifier',
    category: 'Developer',
  },
  {
    slug: 'css-minifier',
    title: 'CSS Minifier',
    description: 'Minify CSS stylesheets to improve website loading speed.',
    component: 'CssMinifier',
    category: 'Developer',
  },
  {
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words and characters in your text instantly.',
    component: 'WordCounter',
    category: 'Text',
  },
];

export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
