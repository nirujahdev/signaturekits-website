import React from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'For You',
      links: [
        { name: 'Track Your Order', href: '/track-order' },
        { name: 'Size chart', href: '/size-guide' },
        { name: 'Policies', href: '/policies/shipping' },
      ],
    },
    {
      title: 'store',
      links: [
        { name: 'collections', href: '/collections/club-jerseys' },
        { name: 'about', href: '/about' },
        { name: 'contact', href: '/contact-us' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white pt-[160px] pb-[40px]">
      <div className="container mx-auto px-6 md:px-[60px]">
        {/* Top Section with Logo and Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-[120px]">
          {/* Large Typographic Brand Signature - Smaller Size */}
          <div className="mb-[64px] lg:mb-0">
            <h2 className="text-[60px] lg:text-[120px] font-semibold tracking-[-0.05em] leading-[0.8] text-black whitespace-nowrap">
              Signature Kits
            </h2>
          </div>

          {/* Structured Link Columns and Instagram */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <div className="grid grid-cols-2 gap-x-[80px] gap-y-[48px]">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex flex-col space-y-[24px]">
                  <h3 className="text-[20px] font-semibold text-black tracking-tight">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col space-y-[12px]">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-[18px] font-medium text-[#999999] hover:text-black transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Instagram Icon */}
            <div className="flex items-center mt-8 lg:mt-0">
              <a
                href="https://instagram.com/signaturekits.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Fine Horizontal Divider */}
        <div className="w-full h-[1.5px] bg-[#EEEEEE] mb-[40px]" />

        {/* Bottom Section: Copyright, Developer Credit & Admin Link */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-[24px] md:space-y-0 relative">
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
