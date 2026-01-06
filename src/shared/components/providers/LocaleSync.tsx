"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { setStoredLocale } from "@/shared/lib/locale-storage";

/**
 * LocaleSync Component
 * Syncs the current locale from next-intl to localStorage
 * This allows non-React code (like API interceptors) to access the current locale
 */
export function LocaleSync() {
  const locale = useLocale();

  useEffect(() => {
    // Store locale in localStorage for API requests
    setStoredLocale(locale);
  }, [locale]);

  // This component doesn't render anything
  return null;
}
