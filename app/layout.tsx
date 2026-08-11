import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "StoryLights House",
  description: "A home for captivating stories and storytellers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            <span className="brand-house">🏠</span>
            <span><b>StoryLights</b><small>HOUSE</small></span>
          </Link>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/write">Write</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <div><b>StoryLights House</b><p>Every story finds a home. Every reader finds a light.</p></div>
          <div><b>Owner</b><p>Olayinka Timilehin<br/>ogunniyaolayinka@gmail.com<br/>08100467107</p></div>
          <div><b>Genres</b><p>Romance · War · Thriller · Fictional</p></div>
        </footer>
      </body>
    </html>
  );
}
