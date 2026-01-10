/**
 * SEO Content Data
 * Centralized content for all pages with exact content from content pack
 */

import { FAQItem } from './seo';
import { replaceVariables } from './seo-config';

// Homepage Content
export const HOMEPAGE_CONTENT = {
  title: 'Football Jerseys Sri Lanka | Premium Retro & Custom Kits – Signature Kits',
  description: 'Buy premium football jerseys in Sri Lanka: club kits, national teams, retro classics, and custom name/number options. Islandwide delivery. Order online today.',
  h1: 'Premium Football Jerseys in Sri Lanka',
  directAnswer: 'Islandwide delivery across Sri Lanka. In-stock and pre-order options. Custom name & number available on selected jerseys.',
  faqs: [
    {
      question: 'How long does delivery take?',
      answer: 'Delivery depends on stock/pre-order; ETA shown on product page and at checkout.',
    },
    {
      question: 'Do you deliver islandwide?',
      answer: 'Yes, we deliver across Sri Lanka.',
    },
    {
      question: 'Can I add name and number?',
      answer: 'Yes, available for selected products.',
    },
    {
      question: 'How do I choose size?',
      answer: 'Use our size guide on every product page.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Use the Track Order page with Order ID + phone number.',
    },
  ] as FAQItem[],
};

// Collection Content (8 collections)
export const COLLECTION_CONTENT: Record<string, {
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  introText: string;
  faqs: FAQItem[];
}> = {
  'club-jerseys': {
    title: 'Club Football Jerseys Sri Lanka | New Season Kits – Signature Kits',
    description: 'Shop club football jerseys in Sri Lanka. New season drops, premium fabric, and optional custom name/number. Islandwide delivery.',
    h1: 'Club Jerseys',
    directAnswer: 'Latest club kits + fan favorites. Delivery ETA shown per item (in-stock vs pre-order).',
    introText: 'Discover the latest club football jerseys from top leagues around the world. We offer new season drops from Premier League, La Liga, Serie A, Bundesliga, and more. Each jersey features premium fabric with Dri-Fit comfort, authentic designs, and sharp printing. Whether you support Manchester United, Real Madrid, Barcelona, or any other top club, find your perfect kit here. All jerseys are available in multiple sizes with optional custom name and number printing. Islandwide delivery across Sri Lanka with clear delivery ETAs shown on each product page.',
    faqs: [
      {
        question: 'What leagues do you cover?',
        answer: 'We offer jerseys from Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and other major European leagues.',
      },
      {
        question: 'Are these official jerseys?',
        answer: 'We offer premium replica jerseys with authentic designs and high-quality materials. These are not official licensed products but feature professional printing and comfortable fit.',
      },
      {
        question: 'Can I customize club jerseys?',
        answer: 'Yes, custom name and number options are available on selected club jerseys. Check the product page for customization availability.',
      },
      {
        question: 'How long is delivery for club jerseys?',
        answer: 'Delivery time depends on whether the item is in-stock or pre-order. The exact ETA is shown on each product page.',
      },
    ],
  },
  'national-team-jerseys': {
    title: 'National Team Jerseys Sri Lanka | International Kits – Signature Kits',
    description: 'Buy national team jerseys in Sri Lanka—international kits, premium comfort, and clean prints. Islandwide delivery.',
    h1: 'National Team Jerseys',
    directAnswer: 'International kits with size options and delivery ETA per product.',
    introText: 'Represent your country with pride. Our collection features national team jerseys from World Cup tournaments, international competitions, and regional championships. From Argentina and Brazil to Portugal, France, England, and beyond, find authentic-looking international kits with premium comfort. Each jersey features breathable fabric, professional printing, and comfortable fit. Perfect for supporting your national team during major tournaments or everyday wear. All sizes available with islandwide delivery across Sri Lanka.',
    faqs: [
      {
        question: 'Which national teams do you offer?',
        answer: 'We offer jerseys from major footballing nations including Argentina, Brazil, Portugal, France, England, Spain, Germany, and many more.',
      },
      {
        question: 'Are World Cup jerseys available?',
        answer: 'Yes, we offer World Cup edition jerseys for various tournaments. Check product pages for specific tournament editions.',
      },
      {
        question: 'Can I add my name to a national team jersey?',
        answer: 'Custom name and number options are available on selected national team jerseys. Check individual product pages for details.',
      },
    ],
  },
  'retro-jerseys': {
    title: 'Retro Football Jerseys Sri Lanka | Classic Kits – Signature Kits',
    description: 'Iconic retro football jerseys in Sri Lanka. Classic designs, premium feel, and limited drops. Islandwide delivery.',
    h1: 'Retro Jerseys',
    directAnswer: 'Throwback kits with limited stock—check product pages for availability.',
    introText: 'Relive the glory days with our collection of iconic retro football jerseys. These classic designs capture the essence of legendary seasons and unforgettable moments in football history. From Brazil 2002 World Cup to Manchester United 1999 treble season, AC Milan 2005 Champions League, and other iconic kits, each retro jersey features authentic period-accurate designs with modern premium materials. Limited stock available—these throwback kits are perfect for collectors and fans who appreciate football history. Islandwide delivery with clear availability shown on each product page.',
    faqs: [
      {
        question: 'What makes a jersey "retro"?',
        answer: 'Retro jerseys are classic designs from past seasons that hold historical significance or are particularly memorable to fans.',
      },
      {
        question: 'Are retro jerseys limited edition?',
        answer: 'Yes, retro jerseys are often limited stock items. Availability depends on supplier inventory and demand.',
      },
      {
        question: 'Can I customize retro jerseys?',
        answer: 'Customization options vary by product. Check individual product pages to see if name and number printing is available.',
      },
    ],
  },
  'kids': {
    title: 'Kids Football Jerseys Sri Lanka | Youth Sizes – Signature Kits',
    description: 'Kids football jerseys in Sri Lanka with comfortable fit and youth sizing. Perfect for gifts. Islandwide delivery.',
    h1: 'Kids Jerseys',
    directAnswer: 'Youth sizing available—refer to the kids size guide for best fit.',
    introText: 'Perfect fit for young fans. Our kids jersey collection features all your favorite teams and players in comfortable youth sizes. From club jerseys to national team kits, we offer the same premium quality and authentic designs in sizes designed specifically for children. Each kids jersey features soft, breathable fabric that\'s comfortable for active play, with durable printing that withstands washing. Great for birthdays, holidays, or just showing team pride. All kids jerseys come with clear sizing guidance—check our size guide to find the perfect fit for your child. Islandwide delivery across Sri Lanka.',
    faqs: [
      {
        question: 'What sizes are available for kids jerseys?',
        answer: 'Kids jerseys are available in youth sizes. Check our size guide for detailed measurements and age recommendations.',
      },
      {
        question: 'Are kids jerseys the same quality as adult jerseys?',
        answer: 'Yes, kids jerseys feature the same premium materials and printing quality, just in youth-appropriate sizing.',
      },
      {
        question: 'Can I add a name and number to kids jerseys?',
        answer: 'Custom name and number options are available on selected kids jerseys. Check product pages for availability.',
      },
    ],
  },
  'player-version': {
    title: 'Player Version Jerseys Sri Lanka | Elite Fit & Fabric – Signature Kits',
    description: 'Shop player version jerseys in Sri Lanka—lightweight feel, athletic fit, sharp details. Islandwide delivery.',
    h1: 'Player Version Jerseys',
    directAnswer: 'Tighter performance fit—use the size guide before ordering.',
    introText: 'Experience the same jerseys worn by professional players. Player version jerseys feature lightweight, performance-grade fabric designed for athletic movement. These jerseys offer a tighter, more athletic fit compared to fan versions, with advanced moisture-wicking technology and breathable materials. Perfect for playing football, training, or if you prefer a more fitted look. Each player version jersey includes premium details like heat-pressed badges, advanced printing technology, and professional-grade construction. Available in multiple sizes—be sure to check our size guide as player versions typically fit tighter than fan versions. Islandwide delivery with clear sizing guidance on each product page.',
    faqs: [
      {
        question: 'What is the difference between player version and fan version?',
        answer: 'Player version jerseys have a tighter, more athletic fit with lightweight performance fabric. Fan versions have a more relaxed fit with standard materials.',
      },
      {
        question: 'Should I size up for player version jerseys?',
        answer: 'Player version jerseys fit tighter. We recommend checking our size guide and potentially sizing up if you prefer a more relaxed fit.',
      },
      {
        question: 'Are player version jerseys suitable for playing football?',
        answer: 'Yes, player version jerseys are designed for athletic performance with moisture-wicking fabric and breathable materials.',
      },
    ],
  },
  'special-editions': {
    title: 'Special Edition Jerseys Sri Lanka | Limited Drops – Signature Kits',
    description: 'Limited and special edition jerseys in Sri Lanka. Unique colorways, fan drops, and premium designs. Islandwide delivery.',
    h1: 'Special Editions',
    directAnswer: 'Limited runs—restocks depend on demand and supplier availability.',
    introText: 'Stand out with limited and special edition jerseys. Our special edition collection features unique colorways, commemorative designs, and exclusive drops that you won\'t find anywhere else. From PSG special editions to club anniversary kits, tournament specials, and fan-exclusive designs, these jerseys offer something truly unique. Each special edition features premium materials and attention to detail, making them perfect for collectors and dedicated fans. Limited stock available—these exclusive designs often sell out quickly. Restocks depend on supplier availability and demand. Islandwide delivery across Sri Lanka with availability clearly shown on each product page.',
    faqs: [
      {
        question: 'What makes a jersey a "special edition"?',
        answer: 'Special edition jerseys feature unique colorways, commemorative designs, or exclusive releases that differ from standard season kits.',
      },
      {
        question: 'Will special edition jerseys be restocked?',
        answer: 'Restocks depend on supplier availability and demand. Limited editions may not be restocked once sold out.',
      },
      {
        question: 'Can I customize special edition jerseys?',
        answer: 'Customization options vary by product. Check individual product pages to see if name and number printing is available.',
      },
    ],
  },
  'custom-name-number': {
    title: 'Custom Name & Number Jerseys Sri Lanka | Personalised Kits – Signature Kits',
    description: 'Personalised jerseys in Sri Lanka. Add your name and number on selected kits. Great for gifts. Islandwide delivery.',
    h1: 'Custom Name & Number',
    directAnswer: 'Customisation available on selected products—shown clearly on the product page.',
    introText: 'Make it personal. Our custom name and number service lets you add your own name and preferred number to selected jerseys. Perfect for creating a unique gift, supporting your favorite player, or simply making your jersey one-of-a-kind. Customization is available on a wide selection of club jerseys, national team kits, and special editions. Simply select your jersey, choose the customization option during checkout, and enter your desired name and number. Professional printing ensures your customization looks great and lasts. Great for birthdays, holidays, or any special occasion. Islandwide delivery with customization clearly marked on product pages.',
    faqs: [
      {
        question: 'Which jerseys can be customized?',
        answer: 'Custom name and number options are available on selected products. Look for the customization option on individual product pages.',
      },
      {
        question: 'Is there an extra charge for customization?',
        answer: 'Customization fees vary by product. The exact cost is shown on the product page when customization is available.',
      },
      {
        question: 'How long does customization take?',
        answer: 'Customization adds to the production time. The total delivery time including customization is shown on the product page.',
      },
      {
        question: 'Can I customize with any name and number?',
        answer: 'Yes, you can choose any name and number combination. Some restrictions may apply for offensive content.',
      },
    ],
  },
  'sri-lanka-jerseys': {
    title: 'Sri Lanka Jerseys | Football & Fan Kits in Sri Lanka – Signature Kits',
    description: 'Sri Lanka jerseys and fan kits. Premium comfort with optional customisation on selected items. Islandwide delivery.',
    h1: 'Sri Lanka Jerseys',
    directAnswer: 'Sri Lanka-themed kits with local delivery options and clear ETAs.',
    introText: 'Support your home team. Our Sri Lanka jersey collection features national team kits, fan editions, and Sri Lanka-themed football apparel. Show your pride for Sri Lankan football with premium quality jerseys featuring comfortable fit, professional printing, and authentic designs. Perfect for match days, training, or everyday wear. Each Sri Lanka jersey is designed with local fans in mind, featuring breathable fabric suitable for Sri Lanka\'s climate and durable construction. Optional customization available on selected items—add your name and number to make it truly yours. Islandwide delivery with fast local shipping options. Clear delivery ETAs shown on each product page.',
    faqs: [
      {
        question: 'What Sri Lanka jerseys do you offer?',
        answer: 'We offer Sri Lanka national team jerseys, fan kits, and Sri Lanka-themed football apparel in various designs.',
      },
      {
        question: 'Do you offer same-day delivery in Colombo?',
        answer: 'Same-day delivery depends on stock availability and location. If available, it will be shown at checkout.',
      },
      {
        question: 'Can I customize Sri Lanka jerseys?',
        answer: 'Custom name and number options are available on selected Sri Lanka jerseys. Check product pages for details.',
      },
    ],
  },
};

// Map old collection slugs to new ones
export const COLLECTION_SLUG_MAP: Record<string, string> = {
  'retro': 'retro-jerseys',
  'clubs': 'club-jerseys',
  'countries': 'national-team-jerseys',
  'kids': 'kids',
};

// Delivery Policy Content
export const DELIVERY_POLICY_CONTENT = {
  title: 'Delivery Policy Sri Lanka | Shipping, ETA & Tracking – Signature Kits',
  description: 'Clear delivery policy for Sri Lanka: shipping timelines, pre-orders, tracking, failed delivery handling, and support.',
  h1: 'Delivery & Shipping Policy',
  directAnswer: replaceVariables('Delivery ETA depends on whether the item is in-stock or pre-order. Tracking details are shared once your order is {TRACKING_STAGE}. Islandwide delivery available across Sri Lanka.'),
  faqs: [
    {
      question: 'How long does delivery take?',
      answer: 'Delivery time varies by product stock type. The exact ETA is shown on each product page and at checkout.',
    },
    {
      question: 'Do you deliver islandwide in Sri Lanka?',
      answer: 'Yes, we deliver across Sri Lanka. Delivery time depends on your location and the product\'s stock status.',
    },
    {
      question: 'What is the difference between in-stock and pre-order?',
      answer: 'In-stock ships faster. Pre-order ships after we source/prepare the item; ETA is shown before you pay.',
    },
    {
      question: 'When do I receive tracking details?',
      answer: replaceVariables('Tracking details are provided once your order reaches the {TRACKING_STAGE} stage.'),
    },
    {
      question: 'Can I change my delivery address after ordering?',
      answer: 'Contact support as soon as possible. Address changes may not be possible after dispatch.',
    },
    {
      question: 'What happens if delivery fails (no one home / wrong address)?',
      answer: 'The courier may re-attempt delivery or hold the parcel. Additional delivery charges may apply depending on the courier policy.',
    },
    {
      question: 'Do you offer Cash on Delivery (COD)?',
      answer: replaceVariables('COD availability depends on your area and the order type. If available, it will appear at checkout.'),
    },
    {
      question: 'Do you deliver same-day within Colombo?',
      answer: replaceVariables('Same-day delivery depends on stock availability and your location. If offered, it will be shown at checkout.'),
    },
    {
      question: 'Can I return or exchange if the size doesn\'t fit?',
      answer: 'Size exchange depends on stock availability and product condition. See our return/exchange rules on the same page.',
    },
    {
      question: 'How do I contact support about a delivery?',
      answer: 'Use WhatsApp/email support with your Order ID for the fastest help.',
    },
  ] as FAQItem[],
};

// Track Order Content
export const TRACK_ORDER_CONTENT = {
  title: 'Track Your Order | Delivery Status – Signature Kits',
  description: 'Enter your Order ID and phone number to view your delivery status and tracking details.',
  h1: 'Track Your Order',
  directAnswer: replaceVariables('Use your Order ID + phone number to see the latest status. Tracking appears once your order is {TRACKING_STAGE}.'),
};

// Helper function to get collection content
export function getCollectionContent(slug: string) {
  // Check if it's an old slug and map it
  const mappedSlug = COLLECTION_SLUG_MAP[slug] || slug;
  return COLLECTION_CONTENT[mappedSlug] || null;
}

// Product FAQ template (can be customized per product)
export const PRODUCT_FAQ_TEMPLATE: FAQItem[] = [
  {
    question: 'How long does delivery take in Sri Lanka?',
    answer: replaceVariables('Delivery takes {DELIVERY_WINDOW} for pre-orders. We deliver islandwide to all major cities including Colombo, Kandy, Galle, and Jaffna.'),
  },
  {
    question: 'Is this jersey original or a replica?',
    answer: 'We offer premium replica jerseys with high-quality materials and authentic designs. These are not official licensed products but are made with Dri-Fit comfort and professional printing.',
  },
  {
    question: 'Can I add name and number?',
    answer: replaceVariables('Yes! You can customize your jersey with any name and number during checkout. {CUSTOM_NAME_NUMBER} - Additional customization fees may apply.'),
  },
  {
    question: 'Do you have cash on delivery?',
    answer: replaceVariables('Yes, we offer cash on delivery (COD) for orders in Sri Lanka. {COD} - You can also pay online via secure payment methods.'),
  },
  {
    question: 'How do I choose the correct size?',
    answer: 'Check our size guide page for detailed measurements. We offer sizes S, M, L, XL, 2XL, and 3XL. If you\'re unsure, contact us for assistance.',
  },
  {
    question: 'Can I track my order?',
    answer: replaceVariables('Yes, once your order is dispatched, you\'ll receive a tracking number. Use our Track Your Order page to monitor delivery status. Tracking appears at {TRACKING_STAGE} stage.'),
  },
  {
    question: 'What if my size doesn\'t fit?',
    answer: 'We offer size exchanges within 7 days of delivery. Contact us with your order number to arrange an exchange. See our Returns Policy for details.',
  },
  {
    question: 'Do you deliver to Jaffna / Kandy / Galle?',
    answer: 'Yes, we deliver islandwide across Sri Lanka including Jaffna, Kandy, Galle, and all major cities. Delivery times may vary by location.',
  },
];

