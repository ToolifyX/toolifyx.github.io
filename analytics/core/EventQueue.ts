import { AnalyticsEvent } from '../types';

export class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private storageKey = 'analytics_event_queue';

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.flush());
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.queue = JSON.parse(stored);
      } catch (e) {
        this.queue = [];
      }
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
  }

  add(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: event.timestamp || Date.now()
    });
    this.saveToStorage();
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
    this.saveToStorage();
  }

  private flush() {
    // This will be called by AnalyticsManager when back online
  }
}
