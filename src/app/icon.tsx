import { ImageResponse } from 'next/og';
import { MetadataRoute } from 'next';

// Generate favicon from the PNG image
export default function Icon(): MetadataRoute.Icons {
  return {
    icon: [
      {
        url: '/assests/ChatGPT Image Jan 10, 2026, 06_31_49 PM.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/assests/ChatGPT Image Jan 10, 2026, 06_31_49 PM.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

