import { PluginCommonModule, VendurePlugin, EventBus, CustomerEvent, OrderEvent } from '@vendure/core';
import { OnModuleInit, Injectable } from '@nestjs/common';
import { customerOperations } from '../lib/supabase-client';

/**
 * Customer Sync Plugin
 * Syncs customer data, addresses, and orders from Vendure to Supabase
 */
@Injectable()
export class CustomerSyncService implements OnModuleInit {
  constructor(private eventBus: EventBus) {}

  onModuleInit() {
    // Sync customer when created or updated
    this.eventBus.ofType(CustomerEvent).subscribe(async (event) => {
      if (event.type === 'created' || event.type === 'updated') {
        const customer = event.entity;
        try {
          await customerOperations.syncCustomer(customer);
          
          // Sync addresses if available
          if (customer.addresses && customer.addresses.length > 0) {
            for (const address of customer.addresses) {
              await customerOperations.syncCustomerAddress(customer.id.toString(), address);
            }
          }
        } catch (error) {
          console.error(`Failed to sync customer ${customer.id}:`, error);
        }
      }
    });

    // Sync order when created or updated
    this.eventBus.ofType(OrderEvent).subscribe(async (event) => {
      if ((event.type === 'created' || event.type === 'updated') && event.entity.customer) {
        const order = event.entity;
        const customer = order.customer;
        
        try {
          // First ensure customer is synced
          await customerOperations.syncCustomer(customer);
          
          // Then sync the order
          await customerOperations.syncOrder(customer.id.toString(), order);
        } catch (error) {
          console.error(`Failed to sync order ${order.code}:`, error);
        }
      }
    });
  }
}

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [CustomerSyncService],
})
export class CustomerSyncPlugin {}

