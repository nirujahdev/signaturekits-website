/**
 * Vendure Operations - STUBBED OUT
 * Vendure has been removed. These stubs return empty data to prevent errors
 * while the frontend is being migrated to Supabase.
 */

export interface ProductCustomFields {
  patchEnabled?: boolean;
  patchType?: string;
  printName?: string;
  printNumber?: string;
}

/**
 * Product Operations - STUBBED
 */
export const productOperations = {
  async getProducts(options?: {
    take?: number;
    skip?: number;
    filter?: any;
    sort?: any;
  }) {
    console.warn('productOperations.getProducts called but Vendure is removed');
    return { products: { items: [], totalItems: 0 } };
  },

  async getProductBySlug(slug: string) {
    console.warn('productOperations.getProductBySlug called but Vendure is removed');
    return { product: null };
  },

  async getProductById(id: string) {
    console.warn('productOperations.getProductById called but Vendure is removed');
    return { product: null };
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

