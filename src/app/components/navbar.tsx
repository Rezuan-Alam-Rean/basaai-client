"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Menu, X, Sun, Moon, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const { user } = useAppSelector((state) => state.auth);
  const unreadMessages = useAppSelector((state) => state.notifications.unreadMessages);
  const dispatch = useAppDispatch();
  const unreadLabel = unreadMessages > 99 ? "99+" : unreadMessages;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Find Listing" },
    { href: "/map", label: "Map View" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">
            BashaAI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-md text-sm transition-colors hover:text-foreground ${
                pathname === l.href
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}
          {user ? (
            <>
              {user.role === 'LISTER' && (
                <Link href="/add-listing">
                  <Button variant="ghost" size="sm" className="text-primary font-semibold">
                    Add Listing
                  </Button>
                </Link>
              )}
              <Link href="/messages">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                      {unreadLabel}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href={user.role === 'LISTER' ? '/lister' : '/seeker'}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === l.href
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/messages"
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                  pathname === "/messages"
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </span>
                {unreadMessages > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {unreadLabel}
                  </span>
                )}
              </Link>
            )}
          </nav>
          <div className="flex gap-2 mt-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground mr-auto"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <>
                <Link href={user.role === 'LISTER' ? '/lister' : '/seeker'} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
