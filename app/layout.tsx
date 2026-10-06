import type { Metadata, Viewport } from "next";
import { Gaegu, Victor_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Matches what `shadcn init @ballpoint/ballpoint` writes into an app.
const gaegu = Gaegu({ variable: "--font-sans", weight: ["300", "400", "700"], subsets: ["latin"] });
// Code only: a mono with a pen-like italic for comments.
const code = Victor_Mono({ variable: "--font-code", subsets: ["latin"] });

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
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-1.5">
          Skip to content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
