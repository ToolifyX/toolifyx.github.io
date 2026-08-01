import { IAnalyticsProvider, AnalyticsEvent, UserProperties } from '../types';
import { analyticsConfig } from '../config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties, setAnalyticsCollectionEnabled, Analytics } from 'firebase/analytics';

export class FirebaseProvider implements IAnalyticsProvider {
  name = 'Firebase';
  private config = analyticsConfig.firebase;
  private analytics: Analytics | null = null;

  async init(): Promise<void> {
    if (!this.config.enabled || typeof window === 'undefined') return;

    try {
      const firebaseConfig = {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        projectId: this.config.projectId,
        storageBucket: this.config.storageBucket,
        messagingSenderId: this.config.messagingSenderId,
        appId: this.config.appId,
        measurementId: this.config.measurementId,
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      this.analytics = getAnalytics(app);
    } catch (error) {
      console.error('[Analytics] Failed to initialize Firebase:', error);
    }
  }

  trackEvent(event: AnalyticsEvent): void {
    if (this.analytics && this.config.enabled) {
      logEvent(this.analytics, event.name as string, event.properties);
    }
  }

  trackPageView(path: string, title?: string): void {
    if (this.analytics && this.config.enabled) {
      logEvent(this.analytics, 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (this.analytics && this.config.enabled) {
      setUserProperties(this.analytics, properties as any);
    }
  }

  setConsent(consented: boolean): void {
    if (this.analytics && this.config.enabled) {
      setAnalyticsCollectionEnabled(this.analytics, consented);
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}
