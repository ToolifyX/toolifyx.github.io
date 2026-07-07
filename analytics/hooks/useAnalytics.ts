import { analytics } from '../core/AnalyticsManager';
import { EventName } from '../types';

export const useAnalytics = () => {
  return {
    track: (name: EventName, properties?: Record<string, any>) => analytics.track(name, properties),
    trackPageView: (path: string, title?: string) => analytics.trackPageView(path, title),
    setUserProperties: (properties: any) => analytics.setUserProperties(properties),
    setConsent: (consented: boolean) => analytics.setConsent(consented),
  };
};
