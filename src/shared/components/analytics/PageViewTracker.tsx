'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { adminService } from '@/features/admin';

// Map path to page name
function getPageName(pathname: string): string {
  // Remove locale prefix (e.g., /th/dashboard -> /dashboard)
  const path = pathname.replace(/^\/(th|en)/, '');

  if (path === '/dashboard' || path === '/') return 'home';
  if (path.startsWith('/dashboard/search')) return 'search';
  if (path.startsWith('/dashboard/place/')) return 'place-detail';
  if (path.startsWith('/dashboard/favorites')) return 'favorites';
  if (path.startsWith('/dashboard/my-folder')) return 'folders';
  if (path.startsWith('/dashboard/ai')) return 'ai-chat';
  if (path.startsWith('/dashboard/map')) return 'map';
  if (path.startsWith('/dashboard/profile')) return 'profile';
  if (path.startsWith('/dashboard/settings')) return 'settings';
  if (path.startsWith('/dashboard/admin')) return 'admin';
  if (path.startsWith('/dashboard/virtual-tour')) return 'virtual-tour';
  if (path.startsWith('/dashboard/translate')) return 'translate';
  if (path.startsWith('/dashboard/qr-code')) return 'qr-code';

  return 'other';
}

// Generate or get session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    // ไม่ track ถ้า path เหมือนเดิม (prevent double tracking)
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Track page view
    const trackPageView = async () => {
      try {
        await adminService.trackPageView({
          pagePath: pathname,
          pageName: getPageName(pathname),
          sessionId: getSessionId(),
        });
      } catch (error) {
        // Silent fail - ไม่ต้อง log error เพราะไม่สำคัญ
        console.debug('Failed to track page view:', error);
      }
    };

    // Delay เล็กน้อยเพื่อให้ page render ก่อน
    const timeoutId = setTimeout(trackPageView, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null; // Component นี้ไม่ render อะไร
}
