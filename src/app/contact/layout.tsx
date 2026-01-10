import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us | Customer Support – Signature Kits',
  description: 'Contact Signature Kits for order support, questions, or assistance. Email support available. Response time: 24-48 hours during business days.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

