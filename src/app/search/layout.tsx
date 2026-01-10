import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search | Signature Kits',
  description: 'Search for football jerseys in Sri Lanka',
  path: '/search',
  noIndex: true,
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

