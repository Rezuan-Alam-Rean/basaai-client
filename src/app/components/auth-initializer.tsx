"use client";

import { ReactNode } from "react";
import { useAuthInit } from "../hooks/useAuthInit";

/**
 * Wrapper component that initializes auth state from localStorage token
 * Must be inside ReduxProvider and wrapped by Providers
 */
export function AuthInitializer({ children }: { children: ReactNode }) {
  // This hook will restore auth state if token exists
  useAuthInit();

  return <>{children}</>;
}
