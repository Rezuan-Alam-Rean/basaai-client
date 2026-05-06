"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams, useParams as useNextParams } from "next/navigation";
import type { ReactNode, ComponentProps } from "react";

type LinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  to: string;
  children?: ReactNode;
};

export function LinkShim({ to, children, ...props }: LinkProps) {
  return (
    <Link href={to} {...props}>
      {children}
    </Link>
  );
}

export function useNavigate() {
  const router = useRouter();

  return (to: string | number) => {
    if (typeof to === "number") {
      if (to < 0) router.back();
      return;
    }

    router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : "",
    hash: "",
  };
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>() {
  return useNextParams() as T;
}

export function useSearchParamsShim() {
  return useSearchParams();
}

export function Outlet({ children }: { children?: ReactNode }) {
  return <>{children ?? null}</>;
}

export function createBrowserRouter(routes: unknown) {
  return routes;
}

export function RouterProvider({ children }: { children?: ReactNode }) {
  return <>{children ?? null}</>;
}

export { LinkShim as Link, useSearchParamsShim as useSearchParams };