import dynamic from 'next/dynamic';
import React from 'react';

const loading = () => <div className="p-8 text-center text-muted-foreground">Loading Tool...</div>;

export const toolRegistry: Record<string, React.ComponentType<any>> = {
  // Developer Tools
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

  // Text Tools
  WordCounter: dynamic(() => import('./components/WordCounter'), { loading, ssr: false }),
  CaseConverter: dynamic(() => import('./components/CaseConverter'), { loading, ssr: false }),
  SlugGenerator: dynamic(() => import('./components/SlugGenerator'), { loading, ssr: false }),
  SpaceRemover: dynamic(() => import('./components/SpaceRemover'), { loading, ssr: false }),
  TextSorter: dynamic(() => import('./components/TextSorter'), { loading, ssr: false }),
  DuplicateRemover: dynamic(() => import('./components/DuplicateRemover'), { loading, ssr: false }),
  TextReverser: dynamic(() => import('./components/TextReverser'), { loading, ssr: false }),
  CharacterCounter: dynamic(() => import('./components/CharacterCounter'), { loading, ssr: false }),
  RandomTextGenerator: dynamic(() => import('./components/RandomTextGenerator'), { loading, ssr: false }),
  LoremIpsumGenerator: dynamic(() => import('./components/LoremIpsumGenerator'), { loading, ssr: false }),

  // Image Tools
  ImageCompressor: dynamic(() => import('./components/ImageCompressor'), { loading, ssr: false }),
  ConvertToPng: dynamic(() => import('./components/ConvertToPng'), { loading, ssr: false }),
  ConvertToJpg: dynamic(() => import('./components/ConvertToJpg'), { loading, ssr: false }),
  ConvertToWebp: dynamic(() => import('./components/ConvertToWebp'), { loading, ssr: false }),
  ImageResizer: dynamic(() => import('./components/ImageResizer'), { loading, ssr: false }),
  ImageEditor: dynamic(() => import('./components/ImageEditor'), { loading, ssr: false }),
  ImageBase64Tool: dynamic(() => import('./components/ImageBase64Tool'), { loading, ssr: false }),
  ImageMetadataTool: dynamic(() => import('./components/ImageMetadataTool'), { loading, ssr: false }),
  ImageColorTool: dynamic(() => import('./components/ImageColorTool'), { loading, ssr: false }),
  ThumbnailGenerator: dynamic(() => import('./components/ThumbnailGenerator'), { loading, ssr: false }),
  BlurDetector: dynamic(() => import('./components/BlurDetector'), { loading, ssr: false }),
  ImageCropTool: dynamic(() => import('./components/ImageCropTool'), { loading, ssr: false }),

  // PDF Tools
  PdfMergeTool: dynamic(() => import('./components/PdfMergeTool'), { loading, ssr: false }),
  PdfSplitTool: dynamic(() => import('./components/PdfSplitTool'), { loading, ssr: false }),
  ImageToPdf: dynamic(() => import('./components/ImageToPdf'), { loading, ssr: false }),
  PdfMetadataTool: dynamic(() => import('./components/PdfMetadataTool'), { loading, ssr: false }),
  PdfRotateTool: dynamic(() => import('./components/PdfRotateTool'), { loading, ssr: false }),
  PdfCompressTool: dynamic(() => import('./components/PdfCompressTool'), { loading, ssr: false }),

  // Design Tools
  ColorPicker: dynamic(() => import('./components/ColorPicker'), { loading, ssr: false }),
  GradientGenerator: dynamic(() => import('./components/GradientGenerator'), { loading, ssr: false }),
  BoxShadowGenerator: dynamic(() => import('./components/BoxShadowGenerator'), { loading, ssr: false }),
  BorderRadiusGenerator: dynamic(() => import('./components/BorderRadiusGenerator'), { loading, ssr: false }),
  ColorPaletteGenerator: dynamic(() => import('./components/ColorPaletteGenerator'), { loading, ssr: false }),
  ContrastChecker: dynamic(() => import('./components/ContrastChecker'), { loading, ssr: false }),
  FontPreviewTool: dynamic(() => import('./components/FontPreviewTool'), { loading, ssr: false }),

  // Utility Tools
  QrCodeGenerator: dynamic(() => import('./components/QrCodeGenerator'), { loading, ssr: false }),
  PasswordGenerator: dynamic(() => import('./components/PasswordGenerator'), { loading, ssr: false }),
  UnitConverter: dynamic(() => import('./components/UnitConverter'), { loading, ssr: false }),
  PercentageCalculator: dynamic(() => import('./components/PercentageCalculator'), { loading, ssr: false }),
};
