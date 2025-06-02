import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Willy AI Agents Platform",
  description: "Create, manage, and automate your workflow with AI-powered agents. Duplicate templates, schedule tasks, and more.",
  openGraph: {
    title: "Willy AI Agents Platform",
    description: "Create, manage, and automate your workflow with AI-powered agents. Duplicate templates, schedule tasks, and more.",
    url: "https://your-app-url.com/",
    siteName: "Willy AI Agents Platform",
    images: [
      {
        url: "https://your-app-url.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Willy AI Agents Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Willy AI Agents Platform",
    description: "Create, manage, and automate your workflow with AI-powered agents. Duplicate templates, schedule tasks, and more.",
    images: ["https://your-app-url.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
        {children}
        <Toaster />
      </GoogleOAuthProvider>
      </body>
    </html>
  );
}
