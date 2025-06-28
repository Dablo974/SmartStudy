import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const geistSans = GeistSans;
const geistMono = GeistMono;

// The SVG for the logo, encoded as a data URI to be used as a favicon.
const faviconDataUri = "data:image/svg+xml,%3csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3e%3cg%3e%3cpath d='M 76 60 C 72 75, 58 80, 50 78' stroke='%23E57E3D' stroke-width='5' fill='none' stroke-linecap='round' /%3e%3cg transform='rotate(15 75 80)'%3e%3crect x='70' y='70' width='10' height='40' fill='%23FECF44' stroke='%23222F49' stroke-width='1.5' rx='2' /%3e%3cpolygon points='70,70 75,60 80,70' fill='%23F7B42F' stroke='%23222F49' stroke-width='1.5' /%3e%3cpolygon points='70,69.5 75,59.5 80,69.5' fill='%23222F49' /%3e%3crect x='70' y='110' width='10' height='6' fill='%23F6A290' stroke='%23222F49' stroke-width='1.5' rx='1' /%3e%3c/g%3e%3cpath d='M 38 90 C 38 95, 43 95, 43 90' stroke='%23F7B42F' stroke-width='3' fill='none' stroke-linecap='round'/%3e%3cpath d='M 43 90 C 43 95, 48 95, 48 90' stroke='%23F7B42F' stroke-width='3' fill='none' stroke-linecap='round'/%3e%3cpath d='M 52 90 C 52 95, 57 95, 57 90' stroke='%23F7B42F' stroke-width='3' fill='none' stroke-linecap='round'/%3e%3cpath d='M 57 90 C 57 95, 62 95, 62 90' stroke='%23F7B42F' stroke-width='3' fill='none' stroke-linecap='round'/%3e%3cpath d='M 50,30 C 20,30 15,65 20,88 C 25,100 75,100 80,88 C 85,65 80,30 50,30 Z' fill='%23345D9D' /%3e%3cpath d='M 20,60 C 10,70 15,85 28,80 C 25,75 25,65 20,60 Z' fill='%234784C3' /%3e%3cpath d='M 45 75 A 5 5 0 0 1 55 75' fill='none' stroke='%234784C3' stroke-width='2' stroke-linecap='round' /%3e%3cpath d='M 55 75 A 5 5 0 0 1 65 75' fill='none' stroke='%234784C3' stroke-width='2' stroke-linecap='round' /%3e%3cpath d='M 40 82 A 5 5 0 0 1 50 82' fill='none' stroke='%234784C3' stroke-width='2' stroke-linecap='round' /%3e%3cpath d='M 50 82 A 5 5 0 0 1 60 82' fill='none' stroke='%234784C3' stroke-width='2' stroke-linecap='round' /%3e%3cpath d='M 60 82 A 5 5 0 0 1 70 82' fill='none' stroke='%234784C3' stroke-width='2' stroke-linecap='round' /%3e%3ccircle cx='38' cy='55' r='15' fill='white' /%3e%3ccircle cx='62' cy='55' r='15' fill='white' /%3e%3ccircle cx='38' cy='55' r='16' stroke='%23222F49' stroke-width='3.5' fill='none' /%3e%3ccircle cx='62' cy='55' r='16' stroke='%23222F49' stroke-width='3.5' fill='none' /%3e%3cline x1='54' y1='55' x2='46' y2='55' stroke='%23222F49' stroke-width='3.5' /%3e%3cpath d='M 32,52 a 8,8 0 0,1 12,0' stroke='%23222F49' stroke-width='3' fill='none' stroke-linecap='round' /%3e%3cpath d='M 56,52 a 8,8 0 0,1 12,0' stroke='%23222F49' stroke-width='3' fill='none' stroke-linecap='round' /%3e%3cpolygon points='47,66 53,66 50,72' fill='%23F7B42F' /%3e%3cpolygon points='50,15 15,35 85,35' fill='%23222F49' /%3e%3crect x='10' y='35' width='80' height='7' fill='%23222F49' /%3e%3cline x1='68' y1='18' x2='68' y2='28' stroke='%23FECF44' stroke-width='2.5' /%3e%3cpath d='M 68,28 l 3,2 l-3,2 l -3,-2 z' fill='%23FECF44' /%3e%3c/g%3e%3c/svg%3e";

export const metadata: Metadata = {
  title: 'SmartStudy Pro',
  description: 'Intelligent MCQ learning platform with spaced repetition.',
  icons: {
    icon: faviconDataUri,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
