import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import path
import { GeistMono } from 'geist/font/mono'; // Corrected import path
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans; // Directly use the font object
const geistMono = GeistMono; // Directly use the font object

export const metadata: Metadata = {
  title: 'SmartStudy Pro',
  description: 'Intelligent MCQ learning platform with spaced repetition.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
