import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BashaAI",
  description: "Find, list, and manage rentals with AI-powered search and messaging.",
  icons: {
    icon: "/bashAiLogo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
