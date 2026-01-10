import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { TRACK_ORDER_CONTENT } from '@/lib/seo-content';

export const metadata: Metadata = generatePageMetadata({
  title: TRACK_ORDER_CONTENT.title,
  description: TRACK_ORDER_CONTENT.description,
  path: '/track-order',
  noIndex: true,
});

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

