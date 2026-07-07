import { IAnalyticsProvider, AnalyticsEvent, UserProperties } from '../types';
import { analyticsConfig } from '../config';

declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

export class MicrosoftClarityProvider implements IAnalyticsProvider {
  name = 'MicrosoftClarity';
  private config = analyticsConfig.clarity;

  async init(): Promise<void> {
    if (!this.config.enabled || typeof window === 'undefined') return;

    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", this.config.projectId as string);
  }

  trackEvent(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.clarity && this.config.enabled) {
      window.clarity("event", event.name, event.properties);
    }
  }

  trackPageView(path: string, title?: string): void {
    // Clarity handles page views automatically via the tag
  }

  setUserProperties(properties: UserProperties): void {
    if (typeof window !== 'undefined' && window.clarity && this.config.enabled) {
      Object.entries(properties).forEach(([key, value]) => {
        window.clarity("set", key, String(value));
      });
    }
  }

  setConsent(consented: boolean): void {
    if (typeof window !== 'undefined' && window.clarity && this.config.enabled) {
      window.clarity("consent", consented);
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}
