import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold">BashaAI</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Bangladesh&apos;s smartest way to find your next home.
            </p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "LinkedIn"].map((s) => (
                <span key={s} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground hover:bg-accent cursor-pointer transition-colors">
                  {s[0]}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-foreground transition-colors">Find Listing</Link></li>
              <li><Link href="/map" className="hover:text-foreground transition-colors">Map View</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["About Us", "Blog", "Careers", "Press"].map((i) => (
                <li key={i}><span className="hover:text-foreground transition-colors cursor-pointer">{i}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((i) => (
                <li key={i}><span className="hover:text-foreground transition-colors cursor-pointer">{i}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; 2025 BashaAI. Made with &hearts; for Bangladesh.
        </div>
      </div>
    </footer>
  );
}
