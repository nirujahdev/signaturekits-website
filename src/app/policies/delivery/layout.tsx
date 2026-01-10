import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { DELIVERY_POLICY_CONTENT } from '@/lib/seo-content';

export const metadata: Metadata = generatePageMetadata({
  title: DELIVERY_POLICY_CONTENT.title,
  description: DELIVERY_POLICY_CONTENT.description,
  path: '/policies/delivery',
});

export default function DeliveryPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

