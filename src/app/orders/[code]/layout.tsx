import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  return generatePageMetadata({
    title: `Order ${params.code} | Order Details – Signature Kits`,
    description: `View your order details, delivery status, and tracking information for order ${params.code}.`,
    path: `/orders/${params.code}`,
    noIndex: true,
  });
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

