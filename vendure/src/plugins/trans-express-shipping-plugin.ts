import { ShippingCalculator, ShippingMethodArgs } from '@vendure/core';

/**
 * Trans Express Shipping Calculator
 * Flat rate or free shipping for Sri Lanka
 */
export const transExpressShippingCalculator = new ShippingCalculator({
  code: 'trans-express-shipping',
  description: [{ languageCode: 'en', value: 'Trans Express Delivery' }],
  args: {
    flatRate: {
      type: 'int',
      ui: { component: 'currency-form-input' },
      label: [{ languageCode: 'en', value: 'Flat Rate' }],
      description: [{ languageCode: 'en', value: 'Flat shipping rate in cents (0 for free shipping)' }],
      defaultValue: 0,
    },
    freeShippingThreshold: {
      type: 'int',
      ui: { component: 'currency-form-input' },
      label: [{ languageCode: 'en', value: 'Free Shipping Threshold' }],
      description: [{ languageCode: 'en', value: 'Order total in cents for free shipping (0 to disable)' }],
      defaultValue: 0,
    },
  },

  calculate: (ctx, order, args) => {
    // Check if order qualifies for free shipping
    if (args.freeShippingThreshold > 0 && order.subTotalWithTax >= args.freeShippingThreshold) {
      return {
        price: 0,
        priceWithTax: 0,
        metadata: {
          method: 'Trans Express',
          freeShipping: true,
          estimatedDays: '15-20',
        },
      };
    }

    // Apply flat rate
    const flatRate = args.flatRate || 0;
    return {
      price: flatRate,
      priceWithTax: flatRate,
      metadata: {
        method: 'Trans Express',
        freeShipping: false,
        estimatedDays: '15-20',
      },
    };
  },
});

