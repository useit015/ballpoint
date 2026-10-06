import type { Metadata } from "next";
import { Gaegu } from "next/font/google";
import "./globals.css";

// Matches what `shadcn init @ballpoint/ballpoint` writes into an app.
const gaegu = Gaegu({ variable: "--font-sans", weight: ["300", "400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ballpoint",
  description: "A shadcn-style component registry drawn in blue ballpoint.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={gaegu.variable}>
      <body>{children}</body>
    </html>
  );
}
