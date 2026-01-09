import { PluginCommonModule, VendurePlugin, ID } from '@vendure/core';
import { gql } from 'apollo-server-core';
import { batchImportOperations } from '../lib/supabase-client';

/**
 * Batch Import Plugin
 * Manages batch imports for supplier orders
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [],
  adminApiExtensions: {
    schema: gql`
      extend type Query {
        importBatches: [ImportBatch!]!
        importBatch(id: ID!): ImportBatch
        batchStatistics(id: ID!): BatchStatistics
      }

      extend type Mutation {
        createImportBatch(input: CreateImportBatchInput!): ImportBatch!
        updateBatchStatus(id: ID!, status: String!): ImportBatch!
        assignOrderToBatch(orderId: ID!, batchId: ID!): ImportBatch!
        exportSupplierPurchaseList(batchId: ID!): String!
      }

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

      type BatchStatistics {
        batchId: ID!
        batchNumber: String!
        status: String!
        orderCount: Int!
        targetOrderCount: Int!
        completionPercentage: Float!
      }

      input CreateImportBatchInput {
        targetOrderCount: Int!
        notes: String
      }
    `,
    resolvers: [
      {
        Query: {
          importBatches: async (ctx, args) => {
            try {
              const supabase = (await import('../lib/supabase-client')).createSupabaseClient();
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
          importBatch: async (ctx, args) => {
            try {
              return await batchImportOperations.getBatch(args.id);
            } catch (error: any) {
              throw new Error(`Failed to fetch batch: ${error.message}`);
            }
          },
          batchStatistics: async (ctx, args) => {
            try {
              return await batchImportOperations.getBatchStatistics(args.id);
            } catch (error: any) {
              throw new Error(`Failed to fetch statistics: ${error.message}`);
            }
          },
        },
        Mutation: {
          createImportBatch: async (ctx, args) => {
            try {
              return await batchImportOperations.createBatch(
                args.input.targetOrderCount,
                args.input.notes
              );
            } catch (error: any) {
              throw new Error(`Failed to create batch: ${error.message}`);
            }
          },
          updateBatchStatus: async (ctx, args) => {
            try {
              return await batchImportOperations.updateBatchStatus(args.id, args.status);
            } catch (error: any) {
              throw new Error(`Failed to update batch: ${error.message}`);
            }
          },
          assignOrderToBatch: async (ctx, args) => {
            try {
              await batchImportOperations.assignOrderToBatch(args.orderId, args.batchId);
              return await batchImportOperations.getBatch(args.batchId);
            } catch (error: any) {
              throw new Error(`Failed to assign order: ${error.message}`);
            }
          },
          exportSupplierPurchaseList: async (ctx, args) => {
            try {
              const supabase = (await import('../lib/supabase-client')).createSupabaseClient();
              const { data, error } = await supabase.rpc('export_supplier_purchase_list', {
                batch_uuid: args.batchId,
              });
              
              if (error) throw error;
              return JSON.stringify(data, null, 2);
            } catch (error: any) {
              throw new Error(`Failed to export purchase list: ${error.message}`);
            }
          },
        },
      },
    ],
  },
})
export class BatchImportPlugin {}

