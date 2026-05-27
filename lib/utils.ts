import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}

export function formatJSON(json: string, indent: number = 2): string {
  try {
    const obj = JSON.parse(json);
    return JSON.stringify(obj, null, indent);
  } catch (e) {
    throw new Error('Invalid JSON');
  }
}

export function safeJSONParse(json: string): any {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/>\s+</g, '><') // Remove space between tags
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .trim();
}

export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s*([{}|:;,])\s*/g, '$1') // Remove spaces around characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}
