import type { Metadata } from "next";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import AIMentor from "@/components/AIMentor";

export const metadata: Metadata = {
  title: "AI MONEY ACADEMY — Learn AI. Build Income.",
  description: "Master practical AI skills, build real projects and discover new ways to use artificial intelligence for work, freelancing and digital business. 100% Free.",
  keywords: "AI education, learn AI, prompt engineering, AI freelancing, artificial intelligence course, AI tools",
  openGraph: {
    title: "AI MONEY ACADEMY — Learn AI. Build Income.",
    description: "Master practical AI skills for work, freelancing and digital business. 100% Free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        <AIMentor />
      </body>
    </html>
  );
}
