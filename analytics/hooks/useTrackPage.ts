import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '../core/AnalyticsManager';

export const useTrackPage = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.trackPageView(pathname, document.title);
    }
  }, [pathname]);
};
