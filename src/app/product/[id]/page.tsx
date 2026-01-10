'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ProductCard from '@/components/ProductCard';
import { useParams, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productOperations } from '@/lib/vendure-operations';
import { useCart } from '@/contexts/CartContext';
import { CustomizationForm } from '@/components/product/CustomizationForm';
import { toast } from 'sonner';
import gsap from 'gsap';
import { DirectAnswer } from '@/components/seo/DirectAnswer';
import { FAQSection } from '@/components/seo/FAQSection';
import { PRODUCT_FAQ_TEMPLATE } from '@/lib/seo-content';
import { SEO_CONFIG } from '@/lib/seo-config';
import { SizeHelper } from '@/components/SizeHelper';

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceWithTax: number;
  price: number;
  currencyCode: string;
  stockLevel: string;
  options: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  assets: Array<{
    id: string;
    preview: string;
    source: string;
  }>;
  variants: ProductVariant[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [customization, setCustomization] = useState({
    patchEnabled: false,
    patchType: undefined as string | undefined,
    printName: undefined as string | undefined,
    printNumber: undefined as string | undefined,
    customizationPrice: 0,
  });
  const [basePrice, setBasePrice] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const infoRef = useRef<HTMLDivElement>(null);
  const imageStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
      tl.fromTo(imageStackRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, delay: 0.2 })
        .fromTo(infoRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }, "-=0.8");
    }
  }, [product]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // Try by slug first, then by ID
      const result = await productOperations.getProductBySlug(id as string);
      if (!result?.product) {
        const resultById = await productOperations.getProductById(id as string);
        if (resultById?.product) {
          setProduct(resultById.product);
        }
      } else {
        setProduct(result.product);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      await addItem(selectedVariant.id, quantity, customization);
      toast.success('Added to cart!');
      router.push('/cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'LKR') => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-[600px] bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = product.assets?.[0]?.preview || '/placeholder-jersey.jpg';
  const images = product.assets?.length > 0 
    ? product.assets.map(a => a.preview)
    : [mainImage, mainImage];

  // Extract size options from variants
  const sizeOptions = product.variants.map(v => ({
    id: v.id,
    name: v.name,
    price: v.priceWithTax,
    stockLevel: v.stockLevel,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[140px] pb-[80px]">
        <div className="container mx-auto px-6 md:px-[60px]">
          <div className="flex flex-col lg:flex-row gap-x-[120px]">
            {/* Left side: Image Stack */}
            <div ref={imageStackRef} className="flex-1 space-y-4 mb-10 lg:mb-0">
              {images.map((img, index) => (
                <div key={index} className="aspect-[4/5] relative bg-[#F5F5F5] overflow-hidden rounded">
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Right side: Product Info */}
            <div ref={infoRef} className="lg:w-[480px]">
              <div className="sticky top-[140px]">
                <h1 className="text-[44px] font-semibold tracking-[-0.03em] leading-[1.05] text-black mb-6">
                  {product.name}
                </h1>
                
                {/* AEO Direct Answer Block */}
                <div className="mb-6">
                  <DirectAnswer
                    deliveryDays={SEO_CONFIG.DELIVERY_WINDOW}
                    hasCustomization={SEO_CONFIG.CUSTOM_NAME_NUMBER}
                    hasCOD={SEO_CONFIG.COD}
                    isPreOrder={true}
                    trackingStage={SEO_CONFIG.TRACKING_STAGE}
                  />
                </div>
                
                {selectedVariant && (
                  <div className="flex flex-col gap-2 mb-12">
                    <div className="flex items-center gap-4">
                      <span className="text-[24px] font-medium text-black">
                        {formatPrice(selectedVariant.priceWithTax, selectedVariant.currencyCode)}
                      </span>
                      {customization.customizationPrice > 0 && (
                        <span className="text-sm text-gray-600">
                          + LKR {customization.customizationPrice.toLocaleString()} customization
                        </span>
                      )}
                    </div>
                    {customization.customizationPrice > 0 && (
                      <div className="text-lg font-semibold text-black">
                        Total: {formatPrice(
                          selectedVariant.priceWithTax + (customization.customizationPrice * 100),
                          selectedVariant.currencyCode
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Size Helper */}
                <div className="mb-12">
                  <SizeHelper mode="auto" />
                </div>

                {/* Size Selector */}
                <div className="mb-12">
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-[14px] text-[#999999] font-medium uppercase tracking-tight">Size</span>
                    {selectedVariant && (
                      <span className="text-[14px] text-black font-semibold ml-1">{selectedVariant.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => {
                          const variant = product.variants.find(v => v.id === size.id);
                          if (variant) setSelectedVariant(variant);
                        }}
                        disabled={size.stockLevel === 'OUT_OF_STOCK'}
                        className={`text-[15px] font-medium transition-all ${
                          selectedVariant?.id === size.id
                            ? 'text-black font-bold border-b-2 border-black'
                            : size.stockLevel === 'OUT_OF_STOCK'
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-[#999999] hover:text-black'
                        }`}
                      >
                        {size.name}
                        {size.stockLevel === 'OUT_OF_STOCK' && ' (Out of Stock)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Form */}
                <div className="mb-12">
                  <CustomizationForm
                    onCustomizationChange={setCustomization}
                  />
                </div>

                {/* Add to Cart Controls */}
                <div className="flex gap-4 mb-12">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-[#E5E5E5] px-4 py-4 min-w-[140px] justify-between bg-[#FBFBFB]">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#999999] hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[16px] font-semibold text-black">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#999999] hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || addingToCart || selectedVariant.stockLevel === 'OUT_OF_STOCK'}
                    className="flex-1 bg-black text-white text-[16px] font-bold py-4 hover:bg-[#1A1A1A] transition-all"
                    size="lg"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </Button>
                </div>

                {/* Info Accordion */}
                <Accordion type="single" collapsible className="w-full border-t border-[#E5E5E5]">
                  <AccordionItem value="information" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="text-[14px] font-semibold text-black uppercase tracking-widest py-6 hover:no-underline">
                      INFORMATION
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-[#666666] pb-6">
                      {product.description || 'Premium quality jersey with authentic design and materials.'}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="shipping" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="text-[14px] font-semibold text-black uppercase tracking-widest py-6 hover:no-underline">
                      SHIPPING
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-[#666666] pb-6">
                      Pre-order items ship in 15-20 days. Free shipping on orders over LKR 5,000. Delivered via Trans Express.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="text-[14px] font-semibold text-black uppercase tracking-widest py-6 hover:no-underline">
                      PAYMENT
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-[1.7] text-[#666666] pb-6">
                      Cash on Delivery (COD) available. SMS verification required.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-[160px]">
            <FAQSection faqs={PRODUCT_FAQ_TEMPLATE} title="Frequently Asked Questions" />
          </section>

          {/* You May Also Like Section */}
          <section className="mt-[160px]">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-[80px] gap-y-10">
              <h2 className="text-[64px] lg:text-[100px] font-semibold tracking-[-0.05em] leading-[0.85] text-black">
                You May<br />Also Like
              </h2>
              <p className="text-[18px] font-medium text-[#666666] lg:max-w-[440px] leading-[1.5] tracking-tight">
                Discover timeless essentials curated just for you. These elevated basics blend comfort and sophistication — ideal additions to your everyday wardrobe.
              </p>
            </div>
            
            {/* This would load related products from Vendure */}
            <div className="text-center text-gray-500 py-12">
              Related products will be loaded here
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
