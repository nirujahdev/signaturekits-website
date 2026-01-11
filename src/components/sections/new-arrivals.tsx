import React from 'react';
import Image from 'next/image';

const CATEGORIES = [
  {
    title: 'Polo',
    href: '/collection/polo',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/BjQfJy7nQoVxvCYTFzwZxprDWiQ-3.jpg',
  },
  {
    title: 'Shirts',
    href: '/collection/shirts',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/e9tQ6gSvJVVX5csWplfqNxX3T8-4.jpg',
  },
  {
    title: 'Tee',
    href: '/collection/tee',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/aEaVp0Cinm159R48O7MzEPPuUA-5.jpg',
  },
  {
    title: 'Jacket',
    href: '/collection/jacket',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/TzYNYizGo5wMkoLWobXEn6ye0-6.jpg',
  },
];

const NewArrivals = () => {
  return (
    <section 
      className="bg-white w-full px-10 md:px-[40px] py-[120px] flex flex-col items-center"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      <div className="max-w-7xl w-full mx-auto">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8 md:gap-0">
          <div className="w-full md:w-1/2">
            <h2 className="text-[64px] md:text-[80px] leading-[1.1] font-normal tracking-[-0.02em] text-black">
              Everyday<br />Essentials
            </h2>
          </div>
          <div className="w-full md:w-1/3 pt-4">
            <p className="text-[20px] leading-[1.5] text-[#666666] font-normal tracking-[-0.01em]">
              Explore our best-selling categories — from crisp polos and refined shirts 
              to versatile jackets and relaxed-fit trousers, made to elevate your 
              everyday wardrobe.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((category) => (
            <a 
              key={category.title}
              href={category.title.toLowerCase()} 
              className="group block overflow-hidden"
            >
              <div className="relative aspect-[1639/2048] mb-4 bg-[#f5f5f5] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="mt-4">
                <p className="product-title text-black text-[16px] font-medium leading-[1.4]">
                  {category.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;