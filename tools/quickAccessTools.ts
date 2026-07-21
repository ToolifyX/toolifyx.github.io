/**
 * Quick access tools displayed in the top navigation bar
 * This is currently empty as per user request to move all tools to the "More Tools" menu.
 */

export interface QuickAccessTool {
  slug: string;
  title: string;
  route: string;
}

export const QUICK_ACCESS_TOOLS: QuickAccessTool[] = [
  {
    slug: 'apps',
    title: 'apps',
    route: '/apps',
  },
];
