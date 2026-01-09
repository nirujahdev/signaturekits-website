import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Collection', href: '#' },
        { name: 'Product', href: '/product' },
        { name: 'About', href: '#' },
      ],
    },
    {
      title: 'Info',
      links: [
        { name: 'News', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Support', href: '#' },
      ],
    },
    {
      title: 'Social',
      links: [
        { name: 'Facebook', href: '#' },
        { name: 'Instagram', href: '#' },
        { name: 'X/Twitter', href: '#' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white pt-[160px] pb-[40px]">
      <div className="container mx-auto px-6 md:px-[60px]">
        {/* Top Section with Logo and Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-[120px]">
          {/* Large Typographic Brand Signature */}
          <div className="mb-[64px] lg:mb-0">
            <h2 className="text-[80px] lg:text-[180px] font-semibold tracking-[-0.05em] leading-[0.8] text-black">
              Signature Kits
            </h2>
          </div>

          {/* Structured Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[100px] gap-y-[48px]">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col space-y-[24px]">
                <h3 className="text-[20px] font-semibold text-black tracking-tight">
                  {section.title}
                </h3>
                <ul className="flex flex-col space-y-[12px]">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-[18px] font-medium text-[#999999] hover:text-black transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Fine Horizontal Divider */}
        <div className="w-full h-[1.5px] bg-[#EEEEEE] mb-[40px]" />

        {/* Bottom Section: Copyright & Developer Credit */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-[24px] md:space-y-0">
          <div className="text-[14px] font-medium text-[#999999]">
            © {currentYear} Signature Kits. All rights reserved
          </div>

          <div className="text-[14px] font-medium text-[#999999]">
            developed by benaiah nicholas nimal
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
