import { IAnalyticsProvider, AnalyticsEvent, UserProperties } from '../types';
import { analyticsConfig } from '../config';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalyticsProvider implements IAnalyticsProvider {
  name = 'GoogleAnalytics';
  private config = analyticsConfig.googleAnalytics;

  async init(): Promise<void> {
    if (!this.config.enabled || typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', this.config.measurementId as string, {
      send_page_view: false // We handle this manually
    });
  }

  trackEvent(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.gtag && this.config.enabled) {
      window.gtag('event', event.name, event.properties);
    }
  }

  trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && window.gtag && this.config.enabled) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        send_to: this.config.measurementId
      });
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (typeof window !== 'undefined' && window.gtag && this.config.enabled) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  setConsent(consented: boolean): void {
    if (typeof window !== 'undefined' && window.gtag && this.config.enabled) {
      window.gtag('consent', 'update', {
        'analytics_storage': consented ? 'granted' : 'denied'
      });
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}
