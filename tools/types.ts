export type ToolCategory = 'Developer' | 'Text' | 'Image' | 'Utility';

export interface Tool {
  slug: string;
  title: string;
  description: string;
  component: string; // The name of the component in the registry
  category: ToolCategory;
}
