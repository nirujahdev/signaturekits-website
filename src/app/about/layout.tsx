import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us | Signature Kits – Premium Football Jerseys in Sri Lanka',
  description: 'Learn about Signature Kits: your premier destination for authentic and premium football jerseys. Club, country, retro, and current jerseys for adults and kids.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

