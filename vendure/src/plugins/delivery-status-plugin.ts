import { PluginCommonModule, VendurePlugin, EventBus, OrderEvent } from '@vendure/core';
import { OnModuleInit, Injectable } from '@nestjs/common';
import { deliveryStatusOperations } from '../lib/supabase-client';

/**
 * Delivery Status Plugin
 * Syncs delivery stage and tracking number between Vendure Order custom fields and Supabase
 */
@Injectable()
export class DeliveryStatusService implements OnModuleInit {
  constructor(private eventBus: EventBus) {}

  onModuleInit() {
    // Listen for order updates to sync delivery status
    this.eventBus.ofType(OrderEvent).subscribe(async (event) => {
      if (event.type === 'updated' && event.entity) {
        const order = event.entity;
        const orderCode = order.code;
        const customFields = order.customFields as any;

        if (customFields?.deliveryStage || customFields?.trackingNumber) {
          try {
            await deliveryStatusOperations.updateDeliveryStatus(
              orderCode,
              (customFields.deliveryStage as any) || 'ORDER_CONFIRMED',
              customFields.trackingNumber || undefined,
              undefined,
              'vendure-admin'
            );
          } catch (error) {
            console.error(`Failed to sync delivery status for order ${orderCode}:`, error);
          }
        }
      }
    });
  }
}

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [DeliveryStatusService],
})
export class DeliveryStatusPlugin {}

