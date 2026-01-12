import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerColumns = [
    {
      title: 'Customer Service',
      links: [
        { name: 'Track Your Order', href: '/track-order' },
        { name: 'Size Chart', href: '/size-chart' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Information',
      links: [
        { name: 'Policies', href: '/policies' },
        { name: 'Collections', href: '/collections' },
        { name: 'Sitemap', href: '/sitemap' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { 
          name: 'Contact', 
          href: '/contact',
        },
        { 
          name: 'Send a hi', 
          href: 'mailto:support@signaturekits.xyz',
          external: true,
        },
        { 
          name: 'Follow us', 
          href: 'https://instagram.com/signaturekits.lk',
          external: true,
        },
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

          {/* Structured Link Columns - 3 Columns */}
          <div className="flex flex-col lg:flex-row items-start lg:items-start gap-8 lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col space-y-[12px]">
                <h3 className="text-[18px] font-semibold text-black tracking-tight">
                  {column.title}
                </h3>
                <ul className="flex flex-col space-y-[12px]">
                  {column.links.map((link) => {
                    const LinkComponent = link.external ? 'a' : Link;
                    const linkProps = link.external 
                      ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                      : { href: link.href };
                    const Icon = link.icon;
                    const isConnectColumn = column.title === 'Connect';

                    return (
                      <li key={link.name}>
                        <LinkComponent
                          {...linkProps}
                          className="group relative text-[15px] md:text-[16px] font-medium text-[#999999] hover:text-black transition-colors min-h-[36px] flex items-center leading-[1.5]"
                        >
                          {Icon && <Icon className="w-4 h-4 mr-2" />}
                          {link.name}
                          {/* Underline animation - extends beyond text width */}
                          <span className={`absolute bottom-0 left-[-4px] h-[2px] bg-black transition-all duration-300 ease-out ${isConnectColumn ? 'w-0 group-hover:w-[calc(50%+4px)]' : 'w-0 group-hover:w-[calc(100%+8px)]'}`} />
                        </LinkComponent>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
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
              className="group relative text-[13px] font-medium text-[#999999] hover:text-black transition-colors"
            >
              admin
              {/* Underline animation - extends beyond text width */}
              <span className="absolute bottom-0 left-[-4px] w-0 h-[2px] bg-black group-hover:w-[calc(100%+8px)] transition-all duration-300 ease-out" />
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
