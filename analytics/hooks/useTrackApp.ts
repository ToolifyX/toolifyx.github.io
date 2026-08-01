import { analytics } from '../core/AnalyticsManager';

export const useTrackApp = () => {
  return {
    trackAppClick: (appId: string, appName: string) => {
      analytics.track('app_store_click', {
        app_id: appId,
        app_name: appName,
        platform: 'google_play'
      });
    }
  };
};
