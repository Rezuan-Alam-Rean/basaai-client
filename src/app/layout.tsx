import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BashaAI",
  description: "Find, list, and manage rentals with AI-powered search and messaging.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
