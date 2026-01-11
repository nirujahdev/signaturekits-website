import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'For You',
      links: [
        { name: 'Track Your Order', href: '/track-order' },
        { name: 'Size Chart', href: '/size-chart' },
        { name: 'Policies', href: '/policies' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Store',
      links: [
        { name: 'Collections', href: '/collections' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white pt-[40px] md:pt-[50px] pb-[30px]">
      <div className="container mx-auto px-6 md:px-[60px]">
        {/* Top Section with Logo and Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-[30px] md:mb-[35px]">
          {/* Large Typographic Brand Signature - Smaller Size */}
          <div className="mb-[24px] md:mb-[30px] lg:mb-0">
            <h2 className="text-[48px] md:text-[60px] lg:text-[120px] font-semibold tracking-[-0.05em] leading-[0.8] text-black whitespace-nowrap">
              Signature Kits
            </h2>
          </div>

          {/* Structured Link Columns */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            <div className="grid grid-cols-2 gap-x-[50px] gap-y-[24px]">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex flex-col space-y-[12px]">
                  <h3 className="text-[18px] font-semibold text-black tracking-tight">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col space-y-[12px]">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-[15px] md:text-[16px] font-medium text-[#999999] hover:text-black transition-colors min-h-[36px] flex items-center leading-[1.5]"
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
        <div className="w-full h-[1px] bg-[#EEEEEE] mb-[24px]" />

        {/* Bottom Section: Copyright, Developer Credit & Admin Link */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-[12px] md:space-y-0 relative">
          <div className="text-[13px] font-medium text-[#999999]">
            © {currentYear} Signature Kits. All rights reserved
          </div>

          {/* Admin Link - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link 
              href="/admin/signin" 
              className="text-[13px] font-medium text-[#999999] hover:text-black transition-colors"
            >
              admin
            </Link>
          </div>

          <div className="text-[13px] font-medium text-[#999999]">
            Developed by Benaiah
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
