import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Checkout | Signature Kits',
  description: 'Complete your order',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

