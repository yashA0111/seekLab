import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeekLab — Interactive Disk Scheduling Laboratory',
  description: 'Understand the movement. Master disk scheduling algorithms through interactive experiments.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
