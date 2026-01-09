/**
 * Vendure GraphQL Queries and Mutations
 * All queries for products, cart, and orders
 */

// Product Queries
export const GET_PRODUCTS = `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          id
          preview
          source
        }
        variants {
          id
          name
          sku
          priceWithTax
          price
          currencyCode
          stockLevel
          options {
            id
            code
            name
          }
        }
        facetValues {
          id
          name
          code
          facet {
            id
            name
            code
          }
        }
        customFields {
          team
          season
          type
          category
        }
      }
      totalItems
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = `
  query GetProductBySlug($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      assets {
        id
        preview
        source
      }
      variants {
        id
        name
        sku
        priceWithTax
        price
        currencyCode
        stockLevel
        options {
          id
          code
          name
        }
      }
      facetValues {
        id
        name
        code
        facet {
          id
          name
          code
        }
      }
      customFields {
        team
        season
        type
        category
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = `
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      assets {
        id
        preview
        source
      }
      variants {
        id
        name
        sku
        priceWithTax
        price
        currencyCode
        stockLevel
        options {
          id
          code
          name
        }
      }
      facetValues {
        id
        name
        code
        facet {
          id
          name
          code
        }
      }
      customFields {
        team
        season
        type
        category
      }
    }
  }
`;

// Cart/Order Mutations
export const ADD_ITEM_TO_ORDER = `
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!, $customFields: OrderLineCustomFieldsInput) {
    addItemToOrder(
      productVariantId: $productVariantId
      quantity: $quantity
      customFields: $customFields
    ) {
      ... on Order {
        id
        code
        state
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          productVariant {
            id
            name
            sku
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                preview
              }
            }
          }
          customFields {
            patchEnabled
            patchType
            printName
            printNumber
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const ADJUST_ORDER_LINE = `
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order {
        id
        code
        state
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          productVariant {
            id
            name
            sku
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                preview
              }
            }
          }
          customFields {
            patchEnabled
            patchType
            printName
            printNumber
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const REMOVE_ORDER_LINE = `
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        id
        code
        state
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          productVariant {
            id
            name
            sku
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                preview
              }
            }
          }
          customFields {
            patchEnabled
            patchType
            printName
            printNumber
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_ACTIVE_ORDER = `
  query GetActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      subTotalWithTax
      shippingWithTax
      currencyCode
      lines {
        id
        quantity
        unitPriceWithTax
        linePriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
          product {
            id
            name
            slug
            featuredAsset {
              preview
            }
          }
        }
        customFields {
          patchEnabled
          patchType
          printName
          printNumber
        }
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        countryCode
        phoneNumber
      }
      shippingLines {
        id
        shippingMethod {
          id
          name
          code
        }
        priceWithTax
      }
      customFields {
        phoneNumber
        phoneVerified
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS = `
  mutation SetShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          countryCode
          phoneNumber
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const SET_SHIPPING_METHOD = `
  mutation SetShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ... on Order {
        id
        shippingLines {
          id
          shippingMethod {
            id
            name
            code
          }
          priceWithTax
        }
        totalWithTax
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const SET_CUSTOM_FIELDS = `
  mutation SetOrderCustomFields($customFields: UpdateOrderInput!) {
    setOrderCustomFields(input: $customFields) {
      ... on Order {
        id
        customFields {
          phoneNumber
          phoneVerified
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const TRANSITION_TO_ARRANGING_PAYMENT = `
  mutation TransitionToArrangingPayment {
    transitionOrderToState(state: "ArrangingPayment") {
      ... on Order {
        id
        code
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const ADD_PAYMENT_TO_ORDER = `
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        code
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_ORDER_BY_CODE = `
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      code
      state
      totalWithTax
      currencyCode
      orderPlacedAt
      lines {
        id
        quantity
        unitPriceWithTax
        linePriceWithTax
        productVariant {
          id
          name
          sku
          product {
            id
            name
            slug
            featuredAsset {
              preview
            }
          }
        }
        customFields {
          patchEnabled
          patchType
          printName
          printNumber
        }
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        countryCode
        phoneNumber
      }
      customFields {
        phoneNumber
        phoneVerified
      }
    }
  }
`;

