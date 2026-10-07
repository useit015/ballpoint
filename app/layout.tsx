import type { Metadata, Viewport } from "next";
import { PaperMarks } from "@/components/paper-marks";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// The registry installs Gaegu through next/font/google, but this site serves
// the same fonts from its own files. Google's CSS for Gaegu is sliced into
// ~90 CJK pieces per weight and next/font preloaded all of them, which choked
// the connection before the one latin file the page needs. These are the
// latin slices only, preloaded, with the fallback metrics adjusted so the swap
// doesn't move anything.
const gaegu = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/gaegu-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/gaegu-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/gaegu-700.woff2", weight: "700", style: "normal" },
  ],
});
// Code only: Recursive, a monospace with a soft, hand-lettered stroke that sits
// beside Gaegu and stays legible. Latin glyphs only, with its Mono and Casual
// axes pinned to 1 (the only values the code ever uses); weight and slant stay
// variable. 118KB instead of the full 298KB.
const code = localFont({
  variable: "--font-code",
  display: "swap",
  src: "./fonts/recursive-code.woff2",
  weight: "300 1000",
  style: "oblique 0deg 15deg",
});

export const metadata: Metadata = {
  title: { default: "Ballpoint", template: "%s · Ballpoint" },
  description: "shadcn-style components drawn in blue ballpoint. Same names, same props, drawn by hand.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ede8df" },
    { media: "(prefers-color-scheme: dark)", color: "#141b2d" },
  ],
  colorScheme: "light dark",
};

// Resolve the theme before first paint: a saved choice, else the system's.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gaegu.variable} ${code.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative flex min-h-dvh flex-col">
        <PaperMarks />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-1.5">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
