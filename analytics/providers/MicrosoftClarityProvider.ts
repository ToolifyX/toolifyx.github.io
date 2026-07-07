import { IAnalyticsProvider, AnalyticsEvent, UserProperties } from '../types';

declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

export class MicrosoftClarityProvider implements IAnalyticsProvider {
  name = 'MicrosoftClarity';
  private projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  async init(): Promise<void> {
    if (!this.projectId || typeof window === 'undefined') return;

    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", this.projectId);
  }

  trackEvent(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity("event", event.name, event.properties);
    }
  }

  trackPageView(path: string, title?: string): void {
    // Clarity handles page views automatically via the tag
  }

  setUserProperties(properties: UserProperties): void {
    if (typeof window !== 'undefined' && window.clarity) {
      Object.entries(properties).forEach(([key, value]) => {
        window.clarity("set", key, String(value));
      });
    }
  }

  setConsent(consented: boolean): void {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity("consent", consented);
    }
  }

  isEnabled(): boolean {
    return !!this.projectId;
  }
}
