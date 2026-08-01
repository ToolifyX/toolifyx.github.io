import { analytics } from '../core/AnalyticsManager';
import { Tool } from '@/tools/types';

export const useTrackTool = (tool: Tool) => {
  return {
    trackOpened: () => analytics.track('tool_opened', { tool_id: tool.slug, tool_name: tool.title, category: tool.category }),
    trackStarted: () => analytics.track('tool_started', { tool_id: tool.slug, tool_name: tool.title }),
    trackProcessed: (properties?: Record<string, any>) => analytics.track('tool_processed', { tool_id: tool.slug, tool_name: tool.title, ...properties }),
    trackCompleted: (properties?: Record<string, any>) => analytics.track('tool_completed', { tool_id: tool.slug, ...properties }),
    trackFailed: (error: string) => analytics.track('tool_failed', { tool_id: tool.slug, error }),
    trackCancelled: () => analytics.track('tool_cancelled', { tool_id: tool.slug }),
    trackCopied: (properties?: Record<string, any>) => analytics.track('tool_output_copied', { tool_id: tool.slug, tool_name: tool.title, ...properties }),
  };
};
