import { AnalyticsEvent, IAnalyticsProvider, UserProperties, EventName } from '../types';
import { EventQueue } from './EventQueue';
import { analyticsConfig } from '../config';

class AnalyticsManager {
  private providers: IAnalyticsProvider[] = [];
  private queue: EventQueue;
  private isInitialized = false;

  constructor() {
    this.queue = new EventQueue();
  }

  registerProvider(provider: IAnalyticsProvider) {
    if (provider.isEnabled()) {
      this.providers.push(provider);
    }
  }

  async init() {
    if (this.isInitialized || !analyticsConfig.enabled) return;

    if (analyticsConfig.debug) {
      this.logStatus();
    }

    await Promise.all(this.providers.map(p => p.init().catch(err => {
      if (analyticsConfig.debug) console.error(`Failed to init provider ${p.name}`, err);
    })));

    this.isInitialized = true;
    this.flushQueue();
  }

  private logStatus() {
    console.log('%cAnalytics initialized', 'color: #0ea5e9; font-weight: bold; font-size: 1.2em;');
    this.providers.forEach(p => {
      console.log(`%c${p.name}%c ✓ Enabled`, 'font-weight: bold;', 'color: #10b981;');
    });
    console.log('----------------');
  }

  track(name: EventName, properties?: Record<string, any>) {
    if (!analyticsConfig.enabled) return;

    const event: AnalyticsEvent = { name, properties, timestamp: Date.now() };

    if (analyticsConfig.debug) {
      console.group(`[Analytics] Event: ${name}`);
      console.log('Payload:', properties);
      console.log('Providers:', this.providers.map(p => p.name).join(', '));
      console.groupEnd();
    }

    if (typeof window !== 'undefined' && !navigator.onLine) {
      this.queue.add(event);
      return;
    }

    this.providers.forEach(p => {
      p.trackEvent(event);
    });
  }

  trackPageView(path: string, title?: string) {
    if (!analyticsConfig.enabled) return;

    if (analyticsConfig.debug) {
      console.log(`[Analytics] PageView: ${path} (${title})`);
    }

    this.providers.forEach(p => {
      p.trackPageView(path, title);
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
