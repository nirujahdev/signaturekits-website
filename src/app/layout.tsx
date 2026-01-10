import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import { HOMEPAGE_CONTENT } from '@/lib/seo-content';

export const metadata: Metadata = {
  title: HOMEPAGE_CONTENT.title,
  description: HOMEPAGE_CONTENT.description,
  icons: {
    icon: [
      { url: '/assests/ChatGPT Image Jan 10, 2026, 06_31_49 PM.png', type: 'image/png' },
    ],
    apple: [
      { url: '/assests/ChatGPT Image Jan 10, 2026, 06_31_49 PM.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </CartProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
