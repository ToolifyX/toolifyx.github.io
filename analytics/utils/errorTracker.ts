import { analytics } from '../core/AnalyticsManager';

export const trackError = (error: Error | string, context?: Record<string, any>) => {
  const message = typeof error === 'string' ? error : error.message;
  analytics.track('error_occurred', {
    error_message: message,
    ...context
  });
};

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, { type: 'uncaught_exception' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason || 'Unhandled Promise Rejection', { type: 'unhandled_rejection' });
  });
}
