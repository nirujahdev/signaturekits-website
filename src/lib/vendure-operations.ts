/**
 * Product Operations - Supabase Implementation
 * Fetches products from Supabase via the public API
 */

export interface ProductCustomFields {
  patchEnabled?: boolean;
  patchType?: string;
  printName?: string;
  printNumber?: string;
}

/**
 * Map Vendure filter format to collection slug
 */
function extractCollectionFromFilter(filter?: any): string | null {
  if (!filter?.facetValueFilters) return null;

  try {
    const facetFilters = filter.facetValueFilters;
    for (const filterGroup of facetFilters) {
      if (filterGroup.and) {
        for (const condition of filterGroup.and) {
          if (condition.code?.eq) {
            return condition.code.eq;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting collection from filter:', error);
  }

  return null;
}

/**
 * Product Operations - Supabase Implementation
 */
export const productOperations = {
  async getProducts(options?: {
    take?: number;
    skip?: number;
    filter?: any;
    sort?: any;
  }) {
    try {
      const params = new URLSearchParams();
      
      if (options?.take) {
        params.append('limit', options.take.toString());
      }
      
      if (options?.skip) {
        params.append('skip', options.skip.toString());
      }

      // Extract collection from filter
      const collection = extractCollectionFromFilter(options?.filter);
      if (collection) {
        params.append('collection', collection);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        console.error('Failed to fetch products:', response.statusText);
        return { products: { items: [], totalItems: 0 } };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: { items: [], totalItems: 0 } };
    }
  },

  async getProductBySlug(slug: string) {
    try {
      const response = await fetch(`/api/products/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { product: null };
        }
        console.error('Failed to fetch product by slug:', response.statusText);
        return { product: null };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return { product: null };
    }
  },

  async getProductById(id: string) {
    try {
      // Use the same endpoint - it supports both slug and ID
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { product: null };
        }
        console.error('Failed to fetch product by ID:', response.statusText);
        return { product: null };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return { product: null };
    }
  },
};

/**
 * Cart Operations - STUBBED
 */
export const cartOperations = {
  async getActiveOrder() {
    // Return null to indicate no active cart
    return { activeOrder: null };
  },

  async addItemToOrder(
    productVariantId: string,
    quantity: number,
    customFields?: ProductCustomFields
  ) {
    console.warn('cartOperations.addItemToOrder called but Vendure is removed');
    return { addItemToOrder: { errorCode: 'NOT_IMPLEMENTED', message: 'Cart functionality not yet migrated to Supabase' } };
  },

  async adjustOrderLine(orderLineId: string, quantity: number) {
    console.warn('cartOperations.adjustOrderLine called but Vendure is removed');
    return { adjustOrderLine: { errorCode: 'NOT_IMPLEMENTED', message: 'Cart functionality not yet migrated to Supabase' } };
  },

  async removeOrderLine(orderLineId: string) {
    console.warn('cartOperations.removeOrderLine called but Vendure is removed');
    return { removeOrderLine: { errorCode: 'NOT_IMPLEMENTED', message: 'Cart functionality not yet migrated to Supabase' } };
  },
};

/**
 * Checkout Operations - STUBBED
 */
export const checkoutOperations = {
  async setShippingAddress(address: {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province?: string;
    postalCode: string;
    countryCode: string;
    phoneNumber?: string;
  }) {
    console.warn('checkoutOperations.setShippingAddress called but Vendure is removed');
    return { setOrderShippingAddress: { errorCode: 'NOT_IMPLEMENTED' } };
  },

  async setShippingMethod(shippingMethodId: string[]) {
    console.warn('checkoutOperations.setShippingMethod called but Vendure is removed');
    return { setOrderShippingMethod: { errorCode: 'NOT_IMPLEMENTED' } };
  },

  async setOrderCustomFields(customFields: {
    phoneNumber?: string;
    phoneVerified?: boolean;
  }) {
    console.warn('checkoutOperations.setOrderCustomFields called but Vendure is removed');
    return { setOrderCustomFields: { errorCode: 'NOT_IMPLEMENTED' } };
  },

  async transitionToArrangingPayment() {
    console.warn('checkoutOperations.transitionToArrangingPayment called but Vendure is removed');
    return { transitionOrderToState: { errorCode: 'NOT_IMPLEMENTED' } };
  },

  async addPaymentToOrder(input: {
    method: string;
    metadata?: Record<string, any>;
  }) {
    console.warn('checkoutOperations.addPaymentToOrder called but Vendure is removed');
    return { addPaymentToOrder: { errorCode: 'NOT_IMPLEMENTED' } };
  },
};

/**
 * Order Operations - STUBBED
 */
export const orderOperations = {
  async getOrderByCode(code: string) {
    console.warn('orderOperations.getOrderByCode called but Vendure is removed');
    return { orderByCode: null };
  },
};

