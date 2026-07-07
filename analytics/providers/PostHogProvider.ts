import { IAnalyticsProvider, AnalyticsEvent, UserProperties } from '../types';
import { analyticsConfig } from '../config';

declare global {
  interface Window {
    posthog: any;
  }
}

export class PostHogProvider implements IAnalyticsProvider {
  name = 'PostHog';
  private config = analyticsConfig.posthog;

  async init(): Promise<void> {
    if (!this.config.enabled || typeof window === 'undefined') return;

    (function(t: Document, e: any) {
      var n, o, i, s;
      e.__SV || (window.posthog = e, e._i = [], e.init = function(i: any, s: any, a: any) {
        function g(t: any, e: any) {
          var n = e.split(".");
          2 == n.length && (t = t[n[0]], e = n[1]), t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        var c = e;
        for (void 0 !== a ? c = e[a] = [] : a = "posthog", c.people = c.people || [], c.toString = function(t: any) {
          var e = "posthog";
          return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
        }, c.people.toString = function() {
          return c.toString(1) + ".people (stub)"
        }, i = "capture identify alias people.set people.set_once set_config register register_once unregister unregister_once opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures onSessionId".split(" "), s = 0; s < i.length; s++) g(c, i[s]);
        e._i.push([i, s, a])
      }, e.__SV = 1)
    })(document, window.posthog || []);

    window.posthog.init(this.config.key as string, {
      api_host: this.config.host,
      capture_pageview: false // Manual
    });
  }

  trackEvent(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.posthog && this.config.enabled) {
      window.posthog.capture(event.name, event.properties);
    }
  }

  trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && window.posthog && this.config.enabled) {
      window.posthog.capture('$pageview', {
        $current_url: path,
        title: title
      });
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (typeof window !== 'undefined' && window.posthog && this.config.enabled) {
      window.posthog.register(properties);
    }
  }

  setConsent(consented: boolean): void {
    if (typeof window !== 'undefined' && window.posthog && this.config.enabled) {
      if (consented) {
        window.posthog.opt_in_capturing();
      } else {
        window.posthog.opt_out_capturing();
      }
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}
