/**
 * Vendure Operations
 * High-level functions for common operations
 */
import { vendureQuery } from './vendure-client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
  GET_PRODUCT_BY_ID,
  GET_ACTIVE_ORDER,
  ADD_ITEM_TO_ORDER,
  ADJUST_ORDER_LINE,
  REMOVE_ORDER_LINE,
  SET_SHIPPING_ADDRESS,
  SET_SHIPPING_METHOD,
  SET_CUSTOM_FIELDS,
  TRANSITION_TO_ARRANGING_PAYMENT,
  ADD_PAYMENT_TO_ORDER,
  GET_ORDER_BY_CODE,
} from './vendure-queries';

export interface ProductCustomFields {
  patchEnabled?: boolean;
  patchType?: string;
  printName?: string;
  printNumber?: string;
}

/**
 * Product Operations
 */
export const productOperations = {
  async getProducts(options?: {
    take?: number;
    skip?: number;
    filter?: any;
    sort?: any;
  }) {
    return vendureQuery(GET_PRODUCTS, { options: options || { take: 20 } });
  },

  async getProductBySlug(slug: string) {
    return vendureQuery(GET_PRODUCT_BY_SLUG, { slug });
  },

  async getProductById(id: string) {
    return vendureQuery(GET_PRODUCT_BY_ID, { id });
  },
};

/**
 * Cart Operations
 */
export const cartOperations = {
  async getActiveOrder() {
    return vendureQuery(GET_ACTIVE_ORDER);
  },

  async addItemToOrder(
    productVariantId: string,
    quantity: number,
    customFields?: ProductCustomFields
  ) {
    return vendureQuery(ADD_ITEM_TO_ORDER, {
      productVariantId,
      quantity,
      customFields: customFields || {},
    });
  },

  async adjustOrderLine(orderLineId: string, quantity: number) {
    return vendureQuery(ADJUST_ORDER_LINE, { orderLineId, quantity });
  },

  async removeOrderLine(orderLineId: string) {
    return vendureQuery(REMOVE_ORDER_LINE, { orderLineId });
  },
};

/**
 * Checkout Operations
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
    return vendureQuery(SET_SHIPPING_ADDRESS, { input: address });
  },

  async setShippingMethod(shippingMethodId: string[]) {
    return vendureQuery(SET_SHIPPING_METHOD, { shippingMethodId });
  },

  async setOrderCustomFields(customFields: {
    phoneNumber?: string;
    phoneVerified?: boolean;
  }) {
    return vendureQuery(SET_CUSTOM_FIELDS, { customFields });
  },

  async transitionToArrangingPayment() {
    return vendureQuery(TRANSITION_TO_ARRANGING_PAYMENT);
  },

  async addPaymentToOrder(input: {
    method: string;
    metadata?: Record<string, any>;
  }) {
    return vendureQuery(ADD_PAYMENT_TO_ORDER, { input });
  },
};

/**
 * Order Operations
 */
export const orderOperations = {
  async getOrderByCode(code: string) {
    return vendureQuery(GET_ORDER_BY_CODE, { code });
  },
};

