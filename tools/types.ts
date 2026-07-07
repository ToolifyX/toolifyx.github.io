export type ToolCategory = "dev" | "text" | "image" | "pdf" | "design" | "utility" | "seo";

export type ImageSubCategory = "Optimize" | "Convert" | "Edit" | "Analyze" | "Utilities";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  component: string;
  category: ToolCategory;
  subCategory?: ImageSubCategory;
  icon?: string;
  iconColor?: string;
  themeColor?: string;
}
