export type ToolCategory = "dev" | "text" | "image" | "pdf" | "design" | "utility";

export type ImageSubCategory = "Optimize" | "Convert" | "Edit" | "Analyze" | "Utilities";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  component: string;
  category: ToolCategory;
  subCategory?: ImageSubCategory;
  icon?: string;
}
