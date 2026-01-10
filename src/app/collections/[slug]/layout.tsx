import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/generate-metadata';
import { getCollectionContent } from '@/lib/seo-content';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const content = getCollectionContent(params.slug);
  
  if (!content) {
    return generatePageMetadata({
      title: `${params.slug} | Signature Kits`,
      description: `Browse ${params.slug} collection`,
      path: `/collections/${params.slug}`,
    });
  }

  return generatePageMetadata({
    title: content.title,
    description: content.description,
    path: `/collections/${params.slug}`,
  });
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

