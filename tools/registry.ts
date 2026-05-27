import dynamic from 'next/dynamic';
import React from 'react';

const loading = () => <div className="p-8 text-center text-muted-foreground">Loading Tool...</div>;

export const toolRegistry: Record<string, React.ComponentType> = {
  ExampleTool: dynamic(() => import('./components/ExampleTool'), { loading, ssr: false }),
  WordCounter: dynamic(() => import('./components/WordCounter'), { loading, ssr: false }),
  JsonFormatter: dynamic(() => import('./components/JsonFormatter'), { loading, ssr: false }),
  JsonValidator: dynamic(() => import('./components/JsonValidator'), { loading, ssr: false }),
  Base64Tool: dynamic(() => import('./components/Base64Tool'), { loading, ssr: false }),
  UrlTool: dynamic(() => import('./components/UrlTool'), { loading, ssr: false }),
  UuidGenerator: dynamic(() => import('./components/UuidGenerator'), { loading, ssr: false }),
  Sha256Generator: dynamic(() => import('./components/Sha256Generator'), { loading, ssr: false }),
  RegexTester: dynamic(() => import('./components/RegexTester'), { loading, ssr: false }),
  TimestampConverter: dynamic(() => import('./components/TimestampConverter'), { loading, ssr: false }),
  HtmlMinifier: dynamic(() => import('./components/HtmlMinifier'), { loading, ssr: false }),
  CssMinifier: dynamic(() => import('./components/CssMinifier'), { loading, ssr: false }),
};
