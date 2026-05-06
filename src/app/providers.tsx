"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { memo, type ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { ReduxProvider } from "./redux/provider";
import { AuthInitializer } from "./components/auth-initializer";

function ProvidersComponent({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <ReduxProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <AuthInitializer>
            {children}
            <Toaster richColors position="top-right" />
          </AuthInitializer>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
}

export const Providers = memo(ProvidersComponent);