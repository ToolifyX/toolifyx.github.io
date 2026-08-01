/**
 * Centralized Analytics Configuration
 * All environment variables are validated and exposed through this module.
 */

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  googleAnalytics: {
    measurementId: string | undefined;
    enabled: boolean;
  };
  posthog: {
    key: string | undefined;
    host: string;
    enabled: boolean;
  };
  clarity: {
    projectId: string | undefined;
    enabled: boolean;
  };
  firebase: {
    enabled: boolean;
    apiKey: string | undefined;
    authDomain: string | undefined;
    projectId: string | undefined;
    storageBucket: string | undefined;
    messagingSenderId: string | undefined;
    appId: string | undefined;
    measurementId: string | undefined;
  };
}

const isDev = process.env.NODE_ENV === 'development';

export const analyticsConfig: AnalyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true' && isDev,
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    enabled: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
  clarity: {
    projectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    enabled: !!process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  },
  firebase: {
    enabled: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
};

/**
 * Validates configuration and logs warnings in development
 */
export function validateConfig() {
  if (!analyticsConfig.enabled) return;

  if (isDev) {
    if (!analyticsConfig.googleAnalytics.measurementId) {
      console.warn('[Analytics] Google Analytics disabled: NEXT_PUBLIC_GA_MEASUREMENT_ID is missing.');
    }
    if (!analyticsConfig.posthog.key) {
      console.warn('[Analytics] PostHog disabled: NEXT_PUBLIC_POSTHOG_KEY is missing.');
    }
    if (!analyticsConfig.clarity.projectId) {
      console.warn('[Analytics] Microsoft Clarity disabled: NEXT_PUBLIC_CLARITY_PROJECT_ID is missing.');
    }
    if (!analyticsConfig.firebase.enabled) {
      console.warn('[Analytics] Firebase Analytics disabled: NEXT_PUBLIC_FIREBASE_API_KEY is missing.');
    }
  }
}
