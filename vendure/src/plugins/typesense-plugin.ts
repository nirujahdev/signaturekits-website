import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Type } from '@nestjs/common';
import { TypesenseService } from './typesense-service';

/**
 * Typesense Plugin
 * Syncs products and variants to Typesense for instant search
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [TypesenseService],
  configuration: (config) => {
    // Plugin configuration
    return config;
  },
})
export class TypesensePlugin {}

