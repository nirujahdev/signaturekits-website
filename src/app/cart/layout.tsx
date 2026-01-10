import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Shopping Cart | Signature Kits',
  description: 'Review your cart items',
  path: '/cart',
  noIndex: true,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}

