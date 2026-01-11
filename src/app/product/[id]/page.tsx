'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { Plus, Minus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const infoRef = useRef<HTMLDivElement>(null);
  const imageStackRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

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

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe && images.length > 1) {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

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
  
  const currentImage = images[selectedImageIndex] || mainImage;

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
      
      <main className="pt-[100px] md:pt-[140px] pb-[60px] md:pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-[1600px]">
          <div className="flex flex-col lg:flex-row gap-x-[80px] lg:gap-x-[120px] gap-y-12 lg:gap-y-0">
            {/* Left side: Large Centered Image with Carousel */}
            <div ref={imageStackRef} className="flex-1 mb-12 lg:mb-0">
              {/* Main Large Image with Navigation */}
              <div 
                ref={mainImageRef}
                className="relative aspect-[4/5] bg-[#FAFAFA] overflow-hidden mb-6 group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  key={selectedImageIndex}
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover luxury-image-zoom transition-opacity duration-500"
                  priority={selectedImageIndex === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Navigation Arrows - Luxury Style */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm border border-black/10 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-black" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm border border-black/10 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black" strokeWidth={2} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded text-[11px] md:text-xs font-medium text-black">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* View in 3D Button (Placeholder) - Hidden on mobile */}
                <button className="hidden md:flex absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-black/10 items-center gap-2 text-sm font-medium text-black hover:bg-white transition-all z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m-2-1l2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  View in 3D
                </button>
              </div>
              
              {/* Thumbnail Carousel */}
              {images.length > 1 && (
                <div className="relative">
                  <div className="thumbnail-carousel flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 relative w-20 h-20 md:w-24 md:h-24 bg-[#F5F5F5] overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-black'
                            : 'border-transparent hover:border-black/30'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </button>
                    ))}
                    {images.length > 4 && (
                      <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-[#F5F5F5] flex items-center justify-center text-xs font-medium text-[#666666] border-2 border-transparent">
                        +{images.length - 4}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Navigation Arrows (if many images) */}
                  {images.length > 4 && (
                    <>
                      <button
                        onClick={() => {
                          const carousel = document.querySelector('.thumbnail-carousel');
                          if (carousel) carousel.scrollBy({ left: -100, behavior: 'smooth' });
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center hover:border-black transition-colors z-10"
                        aria-label="Scroll thumbnails left"
                      >
                        <ChevronLeft className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => {
                          const carousel = document.querySelector('.thumbnail-carousel');
                          if (carousel) carousel.scrollBy({ left: 100, behavior: 'smooth' });
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center hover:border-black transition-colors z-10"
                        aria-label="Scroll thumbnails right"
                      >
                        <ChevronRight className="w-4 h-4 text-black" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right side: Product Info - Luxury Layout */}
            <div ref={infoRef} className="w-full lg:w-[500px]">
              <div className="lg:sticky lg:top-[120px] lg:md:top-[160px]">
                {/* Personalization Header */}
                <div className="mb-6">
                  <p className="luxury-uppercase text-[12px] font-semibold text-black tracking-[0.1em] mb-4">
                    PERSONALIZE WITH INITIALS
                  </p>
                </div>
                
                {/* Product Name */}
                <h1 className="luxury-heading-2 mb-4 md:mb-6 text-[32px] md:text-[40px] lg:text-[48px]">
                  {product.name}
                </h1>
                
                {/* Price */}
                {selectedVariant && (
                  <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-3 mb-2">
                      <span className="text-[24px] md:text-[28px] font-normal text-black tracking-tight">
                        {formatPrice(selectedVariant.priceWithTax, selectedVariant.currencyCode)}
                      </span>
                      {customization.customizationPrice > 0 && (
                        <span className="text-xs md:text-sm text-[#666666]">
                          + {formatPrice(customization.customizationPrice * 100, selectedVariant.currencyCode)} customization
                        </span>
                      )}
                    </div>
                    {customization.customizationPrice > 0 && (
                      <div className="text-[18px] md:text-[20px] font-medium text-black">
                        Total: {formatPrice(
                          selectedVariant.priceWithTax + (customization.customizationPrice * 100),
                          selectedVariant.currencyCode
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Variation Selector (if multiple variants/colors) */}
                {product.variants.length > 1 && (
                  <div className="mb-8">
                    <p className="luxury-uppercase text-[11px] font-semibold text-[#666666] mb-3">
                      Variation
                    </p>
                    <div className="flex gap-3">
                      {product.variants.slice(0, 3).map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`w-16 h-16 border-2 transition-all ${
                            selectedVariant?.id === variant.id
                              ? 'border-black'
                              : 'border-[#E5E5E5] hover:border-black/50'
                          }`}
                        >
                          {/* Color/material preview would go here */}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Helper */}
                <div className="mb-10">
                  <SizeHelper mode="auto" />
                </div>

                {/* Size Selector - Luxury Style */}
                <div className="mb-8 md:mb-10">
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <span className="luxury-uppercase text-[10px] md:text-[11px] font-semibold text-[#666666]">Size</span>
                    {selectedVariant && (
                      <span className="text-[12px] md:text-[13px] text-black font-medium">{selectedVariant.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => {
                          const variant = product.variants.find(v => v.id === size.id);
                          if (variant) setSelectedVariant(variant);
                        }}
                        disabled={size.stockLevel === 'OUT_OF_STOCK'}
                        className={`text-[13px] md:text-[14px] font-medium transition-all py-2 md:py-2.5 px-3 md:px-4 min-h-[40px] md:min-h-[44px] flex items-center justify-center border ${
                          selectedVariant?.id === size.id
                            ? 'text-black border-black bg-black/5'
                            : size.stockLevel === 'OUT_OF_STOCK'
                            ? 'text-[#CCCCCC] border-[#E5E5E5] cursor-not-allowed'
                            : 'text-[#666666] border-[#E5E5E5] hover:border-black hover:text-black'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Form */}
                <div className="mb-10">
                  <CustomizationForm
                    onCustomizationChange={setCustomization}
                  />
                </div>

                {/* Quantity Selector - Mobile First */}
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="luxury-uppercase text-[10px] md:text-[11px] font-semibold text-[#666666]">Quantity</span>
                  <div className="flex items-center border border-[#E5E5E5] px-2 md:px-3 py-1.5 md:py-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#666666] hover:text-black transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[13px] md:text-[14px] font-medium text-black px-3 md:px-4">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#666666] hover:text-black transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Bag Button - Luxury Style */}
                <div className="mb-8 md:mb-10">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || addingToCart || selectedVariant.stockLevel === 'OUT_OF_STOCK'}
                    className="luxury-button w-full disabled:opacity-50 disabled:cursor-not-allowed text-[13px] md:text-sm py-3 md:py-4"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Add to Bag
                      </>
                    )}
                  </button>
                </div>

                {/* Delivery Information */}
                <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#E5E5E5]">
                  <p className="text-[12px] md:text-[13px] text-[#666666] leading-relaxed">
                    Estimated complimentary Express delivery or Collect in Store: <span className="font-medium text-black">Wed, Jan 14 - Thu, Jan 15</span>
                  </p>
                </div>

                {/* Contact & Services */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex items-center gap-2 md:gap-3 text-[12px] md:text-[13px]">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#666666] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <Link href="/contact-us" className="text-black hover:text-[#666666] transition-colors underline">
                      Order by Phone
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-3 text-[12px] md:text-[13px]">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#666666] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Link href="/contact-us" className="text-black hover:text-[#666666] transition-colors underline">
                      Find in store and book an appointment
                    </Link>
                  </div>

                  {/* Services Section */}
                  <div className="pt-2">
                    <button className="flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-black uppercase tracking-wider mb-3">
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Signature Kits Services
                    </button>
                    <div className="pl-6 space-y-1.5 text-[11px] md:text-[12px] text-[#666666]">
                      <p>Complimentary Shipping</p>
                      <p>Complimentary Exchanges & Returns</p>
                      <p>Secure Payments</p>
                      <p>Signature Packaging</p>
                    </div>
                  </div>
                </div>

                {/* Info Accordion */}
                <Accordion type="single" collapsible className="w-full border-t border-[#E5E5E5]">
                  <AccordionItem value="information" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="luxury-uppercase text-[11px] font-semibold text-black py-6 hover:no-underline">
                      Product Description
                    </AccordionTrigger>
                    <AccordionContent className="text-[13px] leading-[1.7] text-[#666666] pb-6">
                      {product.description || 'Premium quality jersey with authentic design and materials.'}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="materials" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="luxury-uppercase text-[11px] font-semibold text-black py-6 hover:no-underline">
                      Materials & Care
                    </AccordionTrigger>
                    <AccordionContent className="text-[13px] leading-[1.7] text-[#666666] pb-6">
                      Premium polyester fabric with moisture-wicking technology. Machine wash cold, gentle cycle. Do not bleach. Hang dry.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="shipping" className="border-b border-[#E5E5E5]">
                    <AccordionTrigger className="luxury-uppercase text-[11px] font-semibold text-black py-6 hover:no-underline">
                      Shipping
                    </AccordionTrigger>
                    <AccordionContent className="text-[13px] leading-[1.7] text-[#666666] pb-6">
                      Pre-order items ship in 15-20 days. Free shipping on orders over LKR 5,000. Delivered via Trans Express.
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
