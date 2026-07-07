import { analytics } from '../core/AnalyticsManager';

export const useTrackSearch = () => {
  return {
    trackSearch: (keyword: string, resultCount: number) => {
      analytics.track('search_submitted', {
        keyword: keyword.toLowerCase().trim().slice(0, 100),
        result_count: resultCount
      });

      if (resultCount === 0) {
        analytics.track('search_no_results', { keyword: keyword.toLowerCase().trim() });
      }
    }
  };
};
