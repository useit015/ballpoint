import type { Metadata, Viewport } from "next";
import { Gaegu, Recursive } from "next/font/google";
import { PaperMarks } from "@/components/paper-marks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Matches what `shadcn init @ballpoint/ballpoint` writes into an app.
const gaegu = Gaegu({ variable: "--font-sans", weight: ["300", "400", "700"], subsets: ["latin"] });
// Code only: Recursive with its Mono and Casual axes, a monospace with a
// soft, hand-lettered stroke that sits beside Gaegu and stays legible.
const code = Recursive({ variable: "--font-code", axes: ["CASL", "MONO", "slnt"], subsets: ["latin"] });

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
