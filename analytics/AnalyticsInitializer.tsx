"use client";

import React, { useEffect } from 'react';
import { analytics } from './core/AnalyticsManager';
import { GoogleAnalyticsProvider } from './providers/GoogleAnalyticsProvider';
import { MicrosoftClarityProvider } from './providers/MicrosoftClarityProvider';
import { PostHogProvider } from './providers/PostHogProvider';
import { useTrackPage } from './hooks/useTrackPage';
import './utils/errorTracker'; // Register global error handlers

export default function AnalyticsInitializer({ children }: { children: React.ReactNode }) {
  // Automatically track page views on route changes
  useTrackPage();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') return;

    // Register providers
    analytics.registerProvider(new GoogleAnalyticsProvider());
    analytics.registerProvider(new MicrosoftClarityProvider());
    analytics.registerProvider(new PostHogProvider());

    // Initialize all providers
    analytics.init();
  }, []);

  return <>{children}</>;
}
