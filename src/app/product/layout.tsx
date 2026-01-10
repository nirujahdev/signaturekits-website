import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'All Products | Football Jerseys Sri Lanka – Signature Kits',
  description: 'Browse all football jerseys available at Signature Kits. Club jerseys, national teams, retro classics, and custom options. Islandwide delivery in Sri Lanka.',
  path: '/product',
});

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}

