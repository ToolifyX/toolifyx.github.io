import { IAnalyticsProvider, AnalyticsEvent, UserProperties } from '../types';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalyticsProvider implements IAnalyticsProvider {
  name = 'GoogleAnalytics';
  private measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  async init(): Promise<void> {
    if (!this.measurementId || typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      send_page_view: false // We handle this manually
    });
  }

  trackEvent(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, event.properties);
    }
  }

  trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        send_to: this.measurementId
      });
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  setConsent(consented: boolean): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': consented ? 'granted' : 'denied'
      });
    }
  }

  isEnabled(): boolean {
    return !!this.measurementId;
  }
}
