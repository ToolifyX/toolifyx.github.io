export type ToolCategory = "dev" | "text" | "image" | "pdf" | "design" | "utility";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  component: string;
  category: ToolCategory;
}
