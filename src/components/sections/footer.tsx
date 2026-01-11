import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'For You',
      links: [
        { name: 'Track Your Order', href: '/track-order' },
        { name: 'Size Chart', href: '/size-guide' },
        { name: 'Policies', href: '/policies' },
      ],
    },
    {
      title: 'Store',
      links: [
        { name: 'Collections', href: '/collections/club-jerseys' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact-us' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white pt-[60px] md:pt-[80px] lg:pt-[100px] pb-[40px]">
      <div className="container mx-auto px-6 md:px-[60px]">
        {/* Top Section with Logo and Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-[40px] md:mb-[50px] lg:mb-[60px]">
          {/* Large Typographic Brand Signature - Smaller Size */}
          <div className="mb-[36px] md:mb-[48px] lg:mb-0">
            <h2 className="text-[48px] md:text-[60px] lg:text-[120px] font-semibold tracking-[-0.05em] leading-[0.8] text-black whitespace-nowrap">
              Signature Kits
            </h2>
          </div>

          {/* Structured Link Columns */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <div className="grid grid-cols-2 gap-x-[60px] gap-y-[36px]">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex flex-col space-y-[18px]">
                  <h3 className="text-[20px] font-semibold text-black tracking-tight">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col space-y-[16px]">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-[16px] md:text-[18px] font-medium text-[#999999] hover:text-black transition-colors min-h-[44px] flex items-center leading-[1.5]"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fine Horizontal Divider */}
        <div className="w-full h-[1.5px] bg-[#EEEEEE] mb-[32px]" />

        {/* Bottom Section: Copyright, Developer Credit & Admin Link */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-[16px] md:space-y-0 relative">
          <div className="text-[14px] font-medium text-[#999999]">
            © {currentYear} Signature Kits. All rights reserved
          </div>

          {/* Admin Link - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link 
              href="/admin/signin" 
              className="text-[14px] font-medium text-[#999999] hover:text-black transition-colors"
            >
              admin
            </Link>
          </div>

          <div className="text-[14px] font-medium text-[#999999]">
            Developed by Benaiah
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
