'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProductHotspot = {
  id: string;
  type: 'product';
  xPct: number;
  yPct: number;
  product: {
    category: string;
    title: string;
    price: string;
    thumbSrc: string;
    href: string;
  };
};

type SearchHotspot = {
  id: string;
  type: 'search';
  xPct: number;
  yPct: number;
  search: {
    label: string;
    href: string;
  };
};

type Hotspot = ProductHotspot | SearchHotspot;

type Slide = {
  id: string;
  headline?: string;
  subtext?: string;
  image: {
    src: string;
    alt: string;
  };
  hotspots: Hotspot[];
};

// Sample data - replace with your actual images and products
const SLIDES: Slide[] = [
  {
    id: 'messi-barca',
    headline: 'Iconic Moments',
    subtext: 'Premium Kits',
    image: {
      src: '/assests/herosection_img.png', // Replace with actual Messi image
      alt: 'Lionel Messi holding Barcelona jersey',
    },
    hotspots: [
      {
        id: 'messi-jersey-product',
        type: 'product',
        xPct: 72,
        yPct: 55,
        product: {
          category: 'Club Jerseys',
          title: 'Barcelona 2016-17 Home',
          price: 'LKR 4,500',
          thumbSrc: '/assests/master version.png',
          href: '/product/barcelona-2016-17-messi-10',
        },
      },
      {
        id: 'messi-search',
        type: 'search',
        xPct: 58,
        yPct: 30,
        search: {
          label: 'Search Messi Jersey',
          href: '/search?q=messi%20barcelona%20jersey',
        },
      },
    ],
  },
  {
    id: 'ronaldo-real',
    headline: 'Iconic Moments',
    subtext: 'Premium Kits',
    image: {
      src: '/assests/herosection_img.png', // Replace with actual Ronaldo image
      alt: 'Cristiano Ronaldo holding Real Madrid jersey',
    },
    hotspots: [
      {
        id: 'ronaldo-jersey-product',
        type: 'product',
        xPct: 68,
        yPct: 58,
        product: {
          category: 'Club Jerseys',
          title: 'Real Madrid 2017-18 Home',
          price: 'LKR 4,500',
          thumbSrc: '/assests/player version.png',
          href: '/product/real-madrid-2017-18-ronaldo-7',
        },
      },
      {
        id: 'ronaldo-search',
        type: 'search',
        xPct: 55,
        yPct: 32,
        search: {
          label: 'Search Ronaldo Jersey',
          href: '/search?q=ronaldo%20real%20madrid%20jersey',
        },
      },
    ],
  },
  {
    id: 'neymar-psg',
    headline: 'Iconic Moments',
    subtext: 'Premium Kits',
    image: {
      src: '/assests/herosection_img.png', // Replace with actual Neymar image
      alt: 'Neymar holding PSG jersey',
    },
    hotspots: [
      {
        id: 'neymar-jersey-product',
        type: 'product',
        xPct: 70,
        yPct: 56,
        product: {
          category: 'Club Jerseys',
          title: 'PSG 2018-19 Home',
          price: 'LKR 4,500',
          thumbSrc: '/assests/retro.png',
          href: '/product/psg-2018-19-neymar-10',
        },
      },
      {
        id: 'neymar-search',
        type: 'search',
        xPct: 60,
        yPct: 28,
        search: {
          label: 'Search Neymar Jersey',
          href: '/search?q=neymar%20psg%20jersey',
        },
      },
    ],
  },
  {
    id: 'mbappe-france',
    headline: 'Iconic Moments',
    subtext: 'Premium Kits',
    image: {
      src: '/assests/herosection_img.png', // Replace with actual Mbappe image
      alt: 'Kylian Mbappe holding France jersey',
    },
    hotspots: [
      {
        id: 'mbappe-jersey-product',
        type: 'product',
        xPct: 65,
        yPct: 52,
        product: {
          category: 'National Team',
          title: 'France 2018 World Cup',
          price: 'LKR 4,500',
          thumbSrc: '/assests/Signature Emboriery.png',
          href: '/product/france-2018-world-cup-mbappe-10',
        },
      },
      {
        id: 'mbappe-search',
        type: 'search',
        xPct: 52,
        yPct: 35,
        search: {
          label: 'Search Mbappe Jersey',
          href: '/search?q=mbappe%20france%20jersey',
        },
      },
    ],
  },
  {
    id: 'haaland-city',
    headline: 'Iconic Moments',
    subtext: 'Premium Kits',
    image: {
      src: '/assests/herosection_img.png', // Replace with actual Haaland image
      alt: 'Erling Haaland holding Manchester City jersey',
    },
    hotspots: [
      {
        id: 'haaland-jersey-product',
        type: 'product',
        xPct: 73,
        yPct: 54,
        product: {
          category: 'Club Jerseys',
          title: 'Manchester City 2022-23 Home',
          price: 'LKR 4,500',
          thumbSrc: '/assests/master version.png',
          href: '/product/manchester-city-2022-23-haaland-9',
        },
      },
      {
        id: 'haaland-search',
        type: 'search',
        xPct: 58,
        yPct: 30,
        search: {
          label: 'Search Haaland Jersey',
          href: '/search?q=haaland%20manchester%20city%20jersey',
        },
      },
    ],
  },
];

interface HotspotDotProps {
  hotspot: Hotspot;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

function HotspotDot({
  hotspot,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onFocus,
  onBlur,
}: HotspotDotProps) {
  const ariaLabel =
    hotspot.type === 'product'
      ? `View ${hotspot.product.title} product`
      : `Search for ${hotspot.search.label}`;

  return (
    <button
      type="button"
      data-hotspot-dot
      className={`absolute w-4 h-4 md:w-3.5 md:h-3.5 rounded-full bg-white border-2 border-white shadow-lg transition-all duration-300 z-10 ${
        isActive ? 'scale-125' : 'scale-100 hover:scale-110'
      } pulse-dot min-w-[44px] min-h-[44px] flex items-center justify-center`}
      style={{
        left: `${hotspot.xPct}%`,
        top: `${hotspot.yPct}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </button>
  );
}

interface ProductTooltipCardProps {
  hotspot: ProductHotspot;
  position: { x: number; y: number };
  onClose: () => void;
}

function ProductTooltipCard({ hotspot, position, onClose }: ProductTooltipCardProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 8;

    let newX = position.x;
    let newY = position.y;

    // Check right edge
    if (rect.right > viewportWidth - padding) {
      newX = position.x - rect.width - 14;
    }

    // Check bottom edge
    if (rect.bottom > viewportHeight - padding) {
      newY = position.y - rect.height - 14;
    }

    // Check left edge
    if (newX < padding) {
      newX = padding;
    }

    // Check top edge
    if (newY < padding) {
      newY = padding;
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [position]);

  return (
    <div
      ref={tooltipRef}
      className="absolute bg-white rounded-lg shadow-xl p-4 min-w-[280px] max-w-[320px] z-50 pointer-events-auto"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        transform: 'translate(0, 0)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href={hotspot.product.href}
        className="flex items-center gap-4 group"
        onClick={onClose}
      >
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={hotspot.product.thumbSrc}
            alt={hotspot.product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {hotspot.product.category}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
            {hotspot.product.title}
          </h3>
          <p className="text-sm font-medium text-gray-900">{hotspot.product.price}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0" />
      </Link>
    </div>
  );
}

interface SearchTooltipCardProps {
  hotspot: SearchHotspot;
  position: { x: number; y: number };
  onClose: () => void;
}

function SearchTooltipCard({ hotspot, position, onClose }: SearchTooltipCardProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 8;

    let newX = position.x;
    let newY = position.y;

    // Check right edge
    if (rect.right > viewportWidth - padding) {
      newX = position.x - rect.width - 14;
    }

    // Check bottom edge
    if (rect.bottom > viewportHeight - padding) {
      newY = position.y - rect.height - 14;
    }

    // Check left edge
    if (newX < padding) {
      newX = padding;
    }

    // Check top edge
    if (newY < padding) {
      newY = padding;
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [position]);

  return (
    <div
      ref={tooltipRef}
      className="absolute bg-white rounded-lg shadow-xl px-4 py-3 z-50 pointer-events-auto"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        transform: 'translate(0, 0)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href={hotspot.search.href}
        className="flex items-center gap-2 group"
        onClick={onClose}
      >
        <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
        <span className="text-sm font-medium text-gray-900">{hotspot.search.label}</span>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors ml-1" />
      </Link>
    </div>
  );
}

export default function IconicKitsHotspotSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openHotspotId, setOpenHotspotId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setOpenHotspotId(null); // Close tooltip on slide change
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Close tooltip on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openHotspotId && isMobile) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-hotspot-tooltip]') && !target.closest('[data-hotspot-dot]')) {
          setOpenHotspotId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openHotspotId, isMobile]);

  // Close tooltip on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openHotspotId) {
        setOpenHotspotId(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openHotspotId]);

  const handleHotspotInteraction = (
    hotspot: Hotspot,
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const slideContainer = button.closest('[data-slide-container]') as HTMLElement;
    
    if (!slideContainer) return;

    const containerRect = slideContainer.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - containerRect.left + 14;
    const y = rect.top + rect.height / 2 - containerRect.top + 14;

    setTooltipPosition({ x, y });
    setOpenHotspotId(hotspot.id);
  };

  const handleHotspotClick = (hotspot: Hotspot, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      // Toggle on mobile
      if (openHotspotId === hotspot.id) {
        setOpenHotspotId(null);
      } else {
        handleHotspotInteraction(hotspot, event);
      }
    } else {
      // On desktop, clicking also opens (for keyboard users)
      handleHotspotInteraction(hotspot, event);
    }
  };

  const currentSlide = SLIDES[selectedIndex];

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">

      {/* Carousel */}
      <div className="embla relative w-full h-full" ref={emblaRef}>
        <div className="embla__viewport w-full h-full">
          <div className="embla__container flex h-full">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className="embla__slide flex-shrink-0 w-full h-full relative"
                data-slide-container
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Dark gradient overlay on left for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                </div>

                {/* Left Overlay Text */}
                <div className="absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-20 max-w-md px-4 md:px-0">
                  {slide.headline && (
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2">
                      {slide.headline}
                    </h2>
                  )}
                  {slide.subtext && (
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 md:mb-6">{slide.subtext}</p>
                  )}
                  <Button
                    asChild
                    className="bg-white text-black hover:bg-gray-100 min-h-[44px] text-sm md:text-base"
                    size="lg"
                  >
                    <Link href="/collections/clubs">Shop Now</Link>
                  </Button>
                </div>

                {/* Hotspots */}
                {slide.hotspots.map((hotspot) => {
                  const isActive = openHotspotId === hotspot.id;
                  return (
                    <div key={hotspot.id} className="relative w-full h-full">
                      <HotspotDot
                        hotspot={hotspot}
                        isActive={isActive}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            handleHotspotInteraction(hotspot, e);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isMobile) {
                            setOpenHotspotId(null);
                          }
                        }}
                        onClick={(e) => handleHotspotClick(hotspot, e)}
                        onFocus={(e) => handleHotspotInteraction(hotspot, e)}
                        onBlur={() => {
                          // Don't close on blur to allow clicking tooltip
                        }}
                      />
                      {isActive && (
                        <div data-hotspot-tooltip>
                          {hotspot.type === 'product' ? (
                            <ProductTooltipCard
                              hotspot={hotspot}
                              position={tooltipPosition}
                              onClose={() => setOpenHotspotId(null)}
                            />
                          ) : (
                            <SearchTooltipCard
                              hotspot={hotspot}
                              position={tooltipPosition}
                              onClose={() => setOpenHotspotId(null)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all min-w-[44px] min-h-[44px]"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          type="button"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all min-w-[44px] min-h-[44px]"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

