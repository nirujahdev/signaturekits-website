import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Signature Kits - Premium Jersey Pre-Order",
  description: "Shop premium jerseys with customization options",
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
