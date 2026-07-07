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
  }
}
