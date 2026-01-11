'use client';

import { BreadcrumbStructuredData } from './StructuredData';

interface ClientBreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>;
}

/**
 * Client-only wrapper for BreadcrumbStructuredData
 * Used in client components to avoid static generation issues
 */
export function ClientBreadcrumbStructuredData({ items }: ClientBreadcrumbStructuredDataProps) {
  return <BreadcrumbStructuredData items={items} />;
}

