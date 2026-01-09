import React from 'react';
import Image from 'next/image';

/**
 * BestSellers Component
 * 
 * A pixel-perfect clone of the "Proven Favorites" section for Calder Co.
 * features:
 * - Three-column product grid
 * - Image swap on hover
 * - Category labels and pricing hierarchy
 * - Custom typography and spacing matching the brand's quiet luxury aesthetic
 */

const PRODUCTS = [
  {
    id: 'relaxed-linen-jacket',
    title: 'Relaxed Linen Jacket',
    category: 'JACKET',
    price: '69.00',
    href: './product/relaxed-linen-jacket',
    imagePrimary: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/vY2nUwZAsphGUDKa3rdmuqv6MA-7.jpg',
    imageSecondary: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/Neip3ZTwRypwsMNwPKSfzaC46c-8.jpg',
  },
  {
    id: 'basic-tee',
    title: 'Basic Regular Fit Tee',
    category: 'TEE',
    price: '19.00',
    href: './product/black-tee',
    imagePrimary: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/CvrAfdHz2Yl0nez9qiIYtvqGI-9.jpg',
    imageSecondary: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/7paF1t6YnNBWcop0OmGOItAo0E-10.jpg',
  },
  {
    id: 'baggy-denim',
    title: 'Baggy Denim Trousers',
    category: 'PANTS',
    price: '49.00',
    href: './product/basic-wax-jeans',
    imagePrimary: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/1t6cW6ncZSmwsl7y12j21hXs-11.jpg',
    imageSecondary: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/849c97f8-d51a-4b1d-ac0a-b06fa1212cb1-calder-co-framer-website/assets/images/bgGp6e4hKOrnCZnSgB3gYKmj9GI-12.jpg',
  },
];

const BestSellers: React.FC = () => {
  return (
    <section className="bg-white py-[120px] px-10 md:px-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <div className="max-w-[500px]">
            <h2 className="text-[64px] md:text-[80px] font-normal leading-[1.1] tracking-[-0.02em] text-black font-display">
              Proven<br />Favorites
            </h2>
          </div>
          <div className="max-w-[420px] mt-4 md:mt-2">
            <p className="text-[20px] font-normal leading-[1.5] tracking-[-0.01em] text-[#666666]">
              Trusted by thousands of customers. These pieces define versatility — perfect for workdays or weekends.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <a href={product.href} className="block relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                {/* Image 1 (Static) */}
                <div className="absolute inset-0 transition-opacity duration-700 ease-in-out group-hover:opacity-0">
                  <img
                    src={product.imagePrimary}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Image 2 (Hover) */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100">
                  <img
                    src={product.imageSecondary}
                    alt={`${product.title} alternate view`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>

              {/* Product Info */}
              <div className="mt-5 flex flex-col gap-1">
                <div className="flex justify-between items-baseline gap-4">
                  <div className="flex flex-col">
                    <a href={product.href} className="text-black text-[16px] font-medium leading-[1.4] hover:opacity-70 transition-opacity">
                      {product.title}
                    </a>
                    <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-black mt-2">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[14px] font-normal text-black mt-[2px] leading-none">$</span>
                    <span className="text-[14px] font-normal text-black leading-none">{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;