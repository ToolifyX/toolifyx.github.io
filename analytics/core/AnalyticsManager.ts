import { AnalyticsEvent, IAnalyticsProvider, UserProperties, EventName } from '../types';
import { EventQueue } from './EventQueue';

class AnalyticsManager {
  private providers: IAnalyticsProvider[] = [];
  private queue: EventQueue;
  private isInitialized = false;
  private debug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';

  constructor() {
    this.queue = new EventQueue();
  }

  registerProvider(provider: IAnalyticsProvider) {
    this.providers.push(provider);
  }

  async init() {
    if (this.isInitialized) return;

    await Promise.all(this.providers.map(p => p.init().catch(err => {
      if (this.debug) console.error(`Failed to init provider ${p.name}`, err);
    })));

    this.isInitialized = true;
    this.flushQueue();
  }

  track(name: EventName, properties?: Record<string, any>) {
    const event: AnalyticsEvent = { name, properties, timestamp: Date.now() };

    if (this.debug) {
      console.log(`[Analytics] ${name}`, properties);
    }

    if (typeof window !== 'undefined' && !navigator.onLine) {
      this.queue.add(event);
      return;
    }

    this.providers.forEach(p => {
      if (p.isEnabled()) {
        p.trackEvent(event);
      }
    });
  }

  trackPageView(path: string, title?: string) {
    if (this.debug) {
      console.log(`[Analytics] PageView: ${path} (${title})`);
    }

    this.providers.forEach(p => {
      if (p.isEnabled()) {
        p.trackPageView(path, title);
      }
    });
  }

  setUserProperties(properties: UserProperties) {
    this.providers.forEach(p => {
      if (p.isEnabled()) {
        p.setUserProperties(properties);
      }
    });
  }

  setConsent(consented: boolean) {
    this.providers.forEach(p => p.setConsent(consented));
  }

  private flushQueue() {
    const events = this.queue.getEvents();
    if (events.length === 0) return;

    events.forEach(event => {
      this.providers.forEach(p => {
        if (p.isEnabled()) {
          p.trackEvent(event);
        }
      });
    });

    this.queue.clear();
  }
}

export const analytics = new AnalyticsManager();
