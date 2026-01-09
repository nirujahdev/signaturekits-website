import { PluginCommonModule, VendurePlugin, ID } from '@vendure/core';
import { gql } from 'apollo-server-core';
import { 
  customerOperations, 
  deliveryStatusOperations, 
  batchImportOperations,
  otpOperations 
} from '../lib/supabase-client';
import { createSupabaseClient } from '../lib/supabase-client';

/**
 * Supabase Data Plugin
 * Exposes all Supabase custom tables via GraphQL for Admin UI
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [],
  adminApiExtensions: {
    schema: gql`
      extend type Query {
        # Customer queries
        supabaseCustomers(options: CustomerListOptions): CustomerList!
        supabaseCustomer(id: ID!): Customer
        supabaseCustomerByVendureId(vendureCustomerId: String!): Customer
        
        # Order queries
        supabaseOrderSummary(orderCode: String!): CustomerOrderSummary
        supabaseOrderItems(orderSummaryId: ID!): [CustomerOrderItem!]!
        supabaseOrders(options: OrderListOptions): OrderList!
        supabaseCustomerOrders(customerId: ID!): [CustomerOrderSummary!]!
        
        # Delivery status queries
        supabaseDeliveryStatus(orderCode: String!): OrderDeliveryStatus
        supabaseDeliveryStatusHistory(orderCode: String!): [OrderDeliveryStatusEvent!]!
        supabaseAllDeliveryStatuses(options: DeliveryStatusListOptions): DeliveryStatusList!
        
        # Batch queries
        supabaseBatches: [ImportBatch!]!
        supabaseBatch(id: ID!): ImportBatch
        supabaseBatchAssignments(batchId: ID!): [OrderBatchAssignment!]!
        
        # OTP queries
        supabaseOTPSessions(options: OTPSessionListOptions): OTPSessionList!
      }

      extend type Mutation {
        # Delivery status mutations
        updateDeliveryStatus(input: UpdateDeliveryStatusInput!): OrderDeliveryStatus!
        
        # Customer mutations
        updateCustomerData(input: UpdateCustomerInput!): Customer!
      }

      # Customer types
      type Customer {
        id: ID!
        vendureCustomerId: String!
        email: String!
        firstName: String!
        lastName: String!
        phoneNumber: String
        phoneVerified: Boolean!
        dateOfBirth: DateTime
        gender: String
        totalOrders: Int!
        totalSpent: Float!
        lastOrderDate: DateTime
        lastOrderCode: String
        isActive: Boolean!
        isVerified: Boolean!
        marketingConsent: Boolean!
        smsNotifications: Boolean!
        emailNotifications: Boolean!
        accountCreatedAt: DateTime!
        lastLoginAt: DateTime
        notes: String
        tags: [String!]!
        customFields: JSON
        addresses: [CustomerAddress!]!
        orders: [CustomerOrderSummary!]!
        createdAt: DateTime!
        updatedAt: DateTime!
      }

      type CustomerAddress {
        id: ID!
        customerId: ID!
        vendureAddressId: String
        fullName: String!
        streetLine1: String!
        streetLine2: String
        city: String!
        province: String
        postalCode: String
        countryCode: String!
        phoneNumber: String
        addressType: String!
        isDefault: Boolean!
        createdAt: DateTime!
        updatedAt: DateTime!
      }

      type CustomerList {
        items: [Customer!]!
        totalItems: Int!
      }

      input CustomerListOptions {
        skip: Int
        take: Int
        search: String
      }

      # Order types
      type CustomerOrderSummary {
        id: ID!
        customerId: ID!
        vendureOrderId: String!
        orderCode: String!
        orderDate: DateTime!
        orderState: String!
        deliveryStage: String!
        paymentMethod: String
        paymentStatus: String
        subtotal: Float!
        taxTotal: Float!
        shippingTotal: Float!
        totalWithTax: Float!
        currencyCode: String!
        shippingAddress: JSON
        trackingNumber: String
        carrier: String
        batchId: ID
        batchNumber: String
        items: [CustomerOrderItem!]!
        deliveryStatus: OrderDeliveryStatus
        customer: Customer
        createdAt: DateTime!
        updatedAt: DateTime!
      }

      type CustomerOrderItem {
        id: ID!
        orderSummaryId: ID!
        vendureOrderLineId: String!
        productId: String!
        productName: String!
        productSlug: String
        variantId: String!
        variantName: String
        sku: String!
        unitPrice: Float!
        unitPriceWithTax: Float!
        quantity: Int!
        lineTotal: Float!
        lineTotalWithTax: Float!
        patchEnabled: Boolean!
        patchType: String
        printName: String
        printNumber: String
        createdAt: DateTime!
      }

      type OrderList {
        items: [CustomerOrderSummary!]!
        totalItems: Int!
      }

      input OrderListOptions {
        skip: Int
        take: Int
        deliveryStage: String
        paymentMethod: String
      }

      # Delivery status types
      type OrderDeliveryStatus {
        id: ID!
        orderCode: String!
        stage: DeliveryStage!
        trackingNumber: String
        note: String
        updatedBy: String
        updatedAt: DateTime!
        createdAt: DateTime!
        history: [OrderDeliveryStatusEvent!]!
      }

      type OrderDeliveryStatusEvent {
        id: ID!
        orderCode: String!
        stage: DeliveryStage!
        trackingNumber: String
        note: String
        updatedBy: String
        updatedAt: DateTime!
      }

      enum DeliveryStage {
        ORDER_CONFIRMED
        SOURCING
        ARRIVED
        DISPATCHED
        DELIVERED
      }

      type DeliveryStatusList {
        items: [OrderDeliveryStatus!]!
        totalItems: Int!
      }

      input DeliveryStatusListOptions {
        skip: Int
        take: Int
        stage: String
      }

      input UpdateDeliveryStatusInput {
        orderCode: String!
        stage: DeliveryStage!
        trackingNumber: String
        note: String
      }

      # Batch types
      type ImportBatch {
        id: ID!
        batchNumber: String!
        status: String!
        orderCount: Int!
        targetOrderCount: Int!
        supplierOrderDate: DateTime
        expectedArrivalDate: DateTime
        actualArrivalDate: DateTime
        dispatchedDate: DateTime
        completedDate: DateTime
        notes: String
        createdAt: DateTime!
        updatedAt: DateTime!
      }

      type OrderBatchAssignment {
        id: ID!
        vendureOrderId: String!
        batchId: ID!
        createdAt: DateTime!
      }

      # OTP types
      type OTPSession {
        id: ID!
        phone: String!
        sessionId: String!
        verified: Boolean!
        attempts: Int!
        expiresAt: DateTime!
        createdAt: DateTime!
      }

      type OTPSessionList {
        items: [OTPSession!]!
        totalItems: Int!
      }

      input OTPSessionListOptions {
        skip: Int
        take: Int
        phone: String
        verified: Boolean
      }

      # Customer mutation input
      input UpdateCustomerInput {
        id: ID!
        phoneNumber: String
        phoneVerified: Boolean
        marketingConsent: Boolean
        smsNotifications: Boolean
        emailNotifications: Boolean
        notes: String
        tags: [String!]
      }

      scalar JSON
      scalar DateTime
    `,
    resolvers: [
      {
        Query: {
          // Customer queries
          supabaseCustomers: async (ctx: any, args: any) => {
            try {
              const options = args.options || {};
              const customers = await customerOperations.getAllCustomers({
                skip: options.skip,
                take: options.take,
                search: options.search,
              });
              
              // Get total count
              const supabase = createSupabaseClient();
              const { count } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true });
              
              return {
                items: customers,
                totalItems: count || customers.length,
              };
            } catch (error: any) {
              throw new Error(`Failed to fetch customers: ${error.message}`);
            }
          },
          
          supabaseCustomer: async (ctx: any, args: any) => {
            try {
              return await customerOperations.getCustomerById(args.id);
            } catch (error: any) {
              throw new Error(`Failed to fetch customer: ${error.message}`);
            }
          },
          
          supabaseCustomerByVendureId: async (ctx: any, args: any) => {
            try {
              return await customerOperations.getCustomerByVendureId(args.vendureCustomerId);
            } catch (error: any) {
              throw new Error(`Failed to fetch customer: ${error.message}`);
            }
          },
          
          // Order queries
          supabaseOrderSummary: async (ctx: any, args: any) => {
            try {
              return await customerOperations.getOrderSummaryByCode(args.orderCode);
            } catch (error: any) {
              throw new Error(`Failed to fetch order summary: ${error.message}`);
            }
          },
          
          supabaseOrderItems: async (ctx: any, args: any) => {
            try {
              return await customerOperations.getOrderItems(args.orderSummaryId);
            } catch (error: any) {
              throw new Error(`Failed to fetch order items: ${error.message}`);
            }
          },
          
          supabaseOrders: async (ctx: any, args: any) => {
            try {
              const options = args.options || {};
              const orders = await customerOperations.getAllOrders({
                skip: options.skip,
                take: options.take,
                deliveryStage: options.deliveryStage,
                paymentMethod: options.paymentMethod,
              });
              
              // Get total count
              const supabase = createSupabaseClient();
              let countQuery = supabase
                .from('customer_orders_summary')
                .select('*', { count: 'exact', head: true });
              
              if (options.deliveryStage) {
                countQuery = countQuery.eq('delivery_stage', options.deliveryStage);
              }
              if (options.paymentMethod) {
                countQuery = countQuery.eq('payment_method', options.paymentMethod);
              }
              
              const { count } = await countQuery;
              
              return {
                items: orders,
                totalItems: count || orders.length,
              };
            } catch (error: any) {
              throw new Error(`Failed to fetch orders: ${error.message}`);
            }
          },
          
          supabaseCustomerOrders: async (ctx: any, args: any) => {
            try {
              return await customerOperations.getCustomerOrders(args.customerId);
            } catch (error: any) {
              throw new Error(`Failed to fetch customer orders: ${error.message}`);
            }
          },
          
          // Delivery status queries
          supabaseDeliveryStatus: async (ctx: any, args: any) => {
            try {
              return await deliveryStatusOperations.getDeliveryStatus(args.orderCode);
            } catch (error: any) {
              throw new Error(`Failed to fetch delivery status: ${error.message}`);
            }
          },
          
          supabaseDeliveryStatusHistory: async (ctx: any, args: any) => {
            try {
              return await deliveryStatusOperations.getDeliveryStatusHistory(args.orderCode);
            } catch (error: any) {
              throw new Error(`Failed to fetch delivery status history: ${error.message}`);
            }
          },
          
          supabaseAllDeliveryStatuses: async (ctx: any, args: any) => {
            try {
              const options = args.options || {};
              const statuses = await deliveryStatusOperations.getAllDeliveryStatuses({
                skip: options.skip,
                take: options.take,
                stage: options.stage,
              });
              
              // Get total count
              const supabase = createSupabaseClient();
              let countQuery = supabase
                .from('order_delivery_status')
                .select('*', { count: 'exact', head: true });
              
              if (options.stage) {
                countQuery = countQuery.eq('stage', options.stage);
              }
              
              const { count } = await countQuery;
              
              return {
                items: statuses,
                totalItems: count || statuses.length,
              };
            } catch (error: any) {
              throw new Error(`Failed to fetch delivery statuses: ${error.message}`);
            }
          },
          
          // Batch queries
          supabaseBatches: async (ctx: any, args: any) => {
            try {
              const supabase = createSupabaseClient();
              const { data, error } = await supabase
                .from('import_batches')
                .select('*')
                .order('created_at', { ascending: false });
              
              if (error) throw error;
              return data || [];
            } catch (error: any) {
              throw new Error(`Failed to fetch batches: ${error.message}`);
            }
          },
          
          supabaseBatch: async (ctx: any, args: any) => {
            try {
              return await batchImportOperations.getBatch(args.id);
            } catch (error: any) {
              throw new Error(`Failed to fetch batch: ${error.message}`);
            }
          },
          
          supabaseBatchAssignments: async (ctx: any, args: any) => {
            try {
              return await batchImportOperations.getBatchAssignments(args.batchId);
            } catch (error: any) {
              throw new Error(`Failed to fetch batch assignments: ${error.message}`);
            }
          },
          
          // OTP queries
          supabaseOTPSessions: async (ctx: any, args: any) => {
            try {
              const options = args.options || {};
              const sessions = await otpOperations.getOTPSessions({
                phone: options.phone,
                verified: options.verified,
                skip: options.skip,
                take: options.take,
              });
              
              // Get total count
              const supabase = createSupabaseClient();
              let countQuery = supabase
                .from('otp_sessions')
                .select('*', { count: 'exact', head: true });
              
              if (options.phone) {
                countQuery = countQuery.eq('phone', options.phone);
              }
              if (options.verified !== undefined) {
                countQuery = countQuery.eq('verified', options.verified);
              }
              
              const { count } = await countQuery;
              
              return {
                items: sessions,
                totalItems: count || sessions.length,
              };
            } catch (error: any) {
              throw new Error(`Failed to fetch OTP sessions: ${error.message}`);
            }
          },
        },
        
        Mutation: {
          updateDeliveryStatus: async (ctx: any, args: any) => {
            try {
              const input = args.input;
              return await deliveryStatusOperations.updateDeliveryStatus(
                input.orderCode,
                input.stage,
                input.trackingNumber,
                input.note,
                ctx.user?.identifier || 'admin'
              );
            } catch (error: any) {
              throw new Error(`Failed to update delivery status: ${error.message}`);
            }
          },
          
          updateCustomerData: async (ctx: any, args: any) => {
            try {
              const input = args.input;
              const updates: any = {};
              
              if (input.phoneNumber !== undefined) updates.phone_number = input.phoneNumber;
              if (input.phoneVerified !== undefined) updates.phone_verified = input.phoneVerified;
              if (input.marketingConsent !== undefined) updates.marketing_consent = input.marketingConsent;
              if (input.smsNotifications !== undefined) updates.sms_notifications = input.smsNotifications;
              if (input.emailNotifications !== undefined) updates.email_notifications = input.emailNotifications;
              if (input.notes !== undefined) updates.notes = input.notes;
              if (input.tags !== undefined) updates.tags = input.tags;
              
              return await customerOperations.updateCustomerData(input.id, updates);
            } catch (error: any) {
              throw new Error(`Failed to update customer data: ${error.message}`);
            }
          },
        },
        
        // Field resolvers
        Customer: {
          addresses: async (customer: any) => {
            try {
              return await customerOperations.getCustomerAddresses(customer.id);
            } catch (error) {
              return [];
            }
          },
          orders: async (customer: any) => {
            try {
              return await customerOperations.getCustomerOrders(customer.id);
            } catch (error) {
              return [];
            }
          },
        },
        
        CustomerOrderSummary: {
          items: async (order: any) => {
            try {
              return await customerOperations.getOrderItems(order.id);
            } catch (error) {
              return [];
            }
          },
          deliveryStatus: async (order: any) => {
            try {
              return await deliveryStatusOperations.getDeliveryStatus(order.order_code);
            } catch (error) {
              return null;
            }
          },
          customer: async (order: any) => {
            try {
              return await customerOperations.getCustomerById(order.customer_id);
            } catch (error) {
              return null;
            }
          },
        },
        
        OrderDeliveryStatus: {
          history: async (status: any) => {
            try {
              return await deliveryStatusOperations.getDeliveryStatusHistory(status.order_code);
            } catch (error) {
              return [];
            }
          },
        },
      },
    ],
  },
})
export class SupabaseDataPlugin {}

