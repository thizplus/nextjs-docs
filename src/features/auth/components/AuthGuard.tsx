"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useHasHydrated } from "../stores/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const hasHydrated = useHasHydrated();
  const hasValidated = useRef(false);

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!hasHydrated) return;

    // ไม่มี token - redirect ไปหน้า login
    if (!token) {
      router.replace("/login");
      return;
    }

    // มี token แต่ยังไม่ได้ validate กับ server (ครั้งแรกหลัง hydration)
    // ตรวจสอบว่ายังไม่เคย validate และยังไม่มี user data
    if (!hasValidated.current && !user) {
      hasValidated.current = true;
      // fetchProfile จะเรียก clearAuth() และ http-client จะ redirect ไป /login
      // ถ้า token หมดอายุ (401 response)
      fetchProfile();
    }
  }, [hasHydrated, token, user, router, fetchProfile]);

  // Always render children - let the layout handle loading state
  // This prevents sidebar from disappearing during hydration
  // If not authenticated after hydration, redirect will happen via useEffect
  return <>{children}</>;
}
