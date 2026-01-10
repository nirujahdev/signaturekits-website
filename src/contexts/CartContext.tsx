'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartOperations, checkoutOperations } from '@/lib/vendure-operations';

interface CartItem {
  id: string;
  quantity: number;
  productVariant: {
    id: string;
    name: string;
    sku: string;
    priceWithTax: number;
    product: {
      id: string;
      name: string;
      slug: string;
      featuredAsset?: {
        preview: string;
      };
    };
  };
  customFields?: {
    patchEnabled?: boolean;
    patchType?: string;
    printName?: string;
    printNumber?: string;
  };
}

interface Cart {
  id: string | null;
  code: string | null;
  state: string | null;
  totalWithTax: number;
  currencyCode: string;
  lines: CartItem[];
  shippingAddress?: any;
  customFields?: {
    phoneNumber?: string;
    phoneVerified?: boolean;
  };
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addItem: (productVariantId: string, quantity: number, customFields?: any) => Promise<void>;
  updateQuantity: (orderLineId: string, quantity: number) => Promise<void>;
  removeItem: (orderLineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  setPhoneVerified: (phone: string, verified: boolean) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const result = await cartOperations.getActiveOrder();
      // Vendure is removed, so always return null cart for now
      setCart(null);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (
    productVariantId: string,
    quantity: number,
    customFields?: any
  ) => {
    try {
      const result = await cartOperations.addItemToOrder(
        productVariantId,
        quantity,
        customFields
      );
      
      if (result?.addItemToOrder?.id) {
        await refreshCart();
      } else if (result?.addItemToOrder?.errorCode) {
        throw new Error(result.addItemToOrder.message);
      }
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (orderLineId: string, quantity: number) => {
    try {
      const result = await cartOperations.adjustOrderLine(orderLineId, quantity);
      
      if (result?.adjustOrderLine?.id) {
        await refreshCart();
      } else if (result?.adjustOrderLine?.errorCode) {
        throw new Error(result.adjustOrderLine.message);
      }
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeItem = async (orderLineId: string) => {
    try {
      const result = await cartOperations.removeOrderLine(orderLineId);
      
      if (result?.removeOrderLine?.id) {
        await refreshCart();
      } else if (result?.removeOrderLine?.errorCode) {
        throw new Error(result.removeOrderLine.message);
      }
    } catch (error: any) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const setPhoneVerified = async (phone: string, verified: boolean) => {
    try {
      await checkoutOperations.setOrderCustomFields({
        phoneNumber: phone,
        phoneVerified: verified,
      });
      await refreshCart();
    } catch (error) {
      console.error('Error setting phone verified:', error);
      throw error;
    }
  };

  const itemCount = cart?.lines?.reduce((sum, line) => sum + line.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart,
        setPhoneVerified,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

