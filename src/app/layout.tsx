import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keep fonts
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasks - Todo App",
  description: "A beautiful, feature-rich todo application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="pt-8">{children}</div>
              <Toaster position="top-center" richColors />
            </div>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
