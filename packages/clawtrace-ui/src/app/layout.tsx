import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClawTrace UI',
  description: 'Standalone ClawTrace UI package using Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
