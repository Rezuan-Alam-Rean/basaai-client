"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "../redux/features/auth/authApi";
import { useAppSelector } from "../redux/hooks";

const listerOnlyPrefixes = ["/lister", "/add-listing", "/edit-listing"];
const seekerOnlyPrefixes = ["/seeker", "/saved-listings", "/ai-history"];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const user = useAppSelector((state) => state.auth.user);
  const [clientReady, setClientReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setClientReady(true);
    setToken(localStorage.getItem("token"));
  }, []);

  const { isFetching, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const requiredRole = useMemo(() => {
    if (matchesPrefix(pathname, listerOnlyPrefixes)) return "LISTER";
    if (matchesPrefix(pathname, seekerOnlyPrefixes)) return "SEEKER";
    return null;
  }, [pathname]);

  useEffect(() => {
    if (!clientReady) return;

    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isError) {
      localStorage.removeItem("token");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [clientReady, token, isError, router, pathname]);

  const isAuthLoading = Boolean(token) && (isLoading || isFetching) && !user;
  const isRoleMismatch = Boolean(requiredRole && user && user.role !== requiredRole);

  if (!clientReady) return null;
  if (!token || isError) return null;
  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (isRoleMismatch) {
    const destination = user?.role === "LISTER" ? "/lister" : "/seeker";
    const title = "Access restricted";
    const message = user?.role === "LISTER"
      ? "This area is only for seekers. Your account is a lister account."
      : "This area is only for listers. Your account is a seeker account.";

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground mb-5">{message}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.replace(destination)}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go to your dashboard
            </button>
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm text-foreground hover:bg-accent"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
