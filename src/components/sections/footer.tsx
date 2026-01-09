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
              Calder Co.
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

        {/* Bottom Section: Copyright & Platform Badges */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-[24px] md:space-y-0">
          <div className="text-[14px] font-medium text-[#999999]">
            © {currentYear} Calder Co. All rights reserved
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#EEEEEE] rounded-[4px] bg-white cursor-pointer hover:bg-[#F9F9F9] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0Z" fill="black"/>
                <path d="M4 7H10M7 4V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-bold text-black uppercase tracking-wider">Framer Commerce</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#EEEEEE] rounded-[4px] bg-white cursor-pointer hover:bg-[#F9F9F9] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H14V14H0V0Z" fill="black"/>
                <path d="M4 4L10 10M10 4L4 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-bold text-black uppercase tracking-wider">Made in Framer</span>
            </div>
          </div>

          <div className="text-[14px] font-medium text-[#999999]">
            Design by Mino
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
