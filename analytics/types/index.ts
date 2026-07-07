export type EventName =
  | 'page_view'
  | 'session_start'
  | 'session_end'
  | 'tool_opened'
  | 'tool_started'
  | 'tool_completed'
  | 'tool_failed'
  | 'tool_cancelled'
  | 'tool_shared'
  | 'tool_favorited'
  | 'tool_unfavorited'
  | 'download'
  | 'copy'
  | 'paste'
  | 'upload'
  | 'settings_changed'
  | 'search_submitted'
  | 'search_no_results'
  | 'performance_metric'
  | 'error_occurred';

export interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface UserProperties {
  theme?: string;
  language?: string;
  browser?: string;
  os?: string;
  device?: string;
  screen_size?: string;
  preferred_category?: string;
  favorite_count?: number;
  returning_user?: boolean;
}

export interface IAnalyticsProvider {
  name: string;
  init(): Promise<void>;
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(path: string, title?: string): void;
  setUserProperties(properties: UserProperties): void;
  setConsent(consented: boolean): void;
  isEnabled(): boolean;
}
