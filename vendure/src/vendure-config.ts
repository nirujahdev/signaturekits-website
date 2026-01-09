import path from 'path';
import { VendureConfig } from '@vendure/core';
import { AdminPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { EmailPlugin } from '@vendure/email-plugin';
import { TypesensePlugin } from './plugins/typesense-plugin';
import { payherePaymentHandler } from './plugins/payhere-payment-plugin';
import { codPaymentHandler } from './plugins/cod-payment-plugin';
import { transExpressShippingCalculator } from './plugins/trans-express-shipping-plugin';
import { BatchImportPlugin } from './plugins/batch-import-plugin';
import { DeliveryStatusPlugin } from './plugins/delivery-status-plugin';
import { CustomerSyncPlugin } from './plugins/customer-sync-plugin';

/**
 * Custom fields for OrderLine to store jersey customization
 */
export const customFields = {
  OrderLine: [
    {
      name: 'patchEnabled',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'Patch Enabled' }],
      description: [{ languageCode: 'en', value: 'Whether a patch is added to this jersey' }],
    },
    {
      name: 'patchType',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Patch Type' }],
      description: [{ languageCode: 'en', value: 'Type of patch (e.g., "Premier League", "Champions League")' }],
    },
    {
      name: 'printName',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Printed Name' }],
      description: [{ languageCode: 'en', value: 'Name to print on the jersey' }],
    },
    {
      name: 'printNumber',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Printed Number' }],
      description: [{ languageCode: 'en', value: 'Number to print on the jersey' }],
    },
  ],
  Order: [
    {
      name: 'phoneNumber',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Phone Number' }],
      description: [{ languageCode: 'en', value: 'Customer phone number (Sri Lanka format)' }],
    },
    {
      name: 'phoneVerified',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'Phone Verified' }],
      description: [{ languageCode: 'en', value: 'Phone number has been verified via SMS OTP' }],
    },
    {
      name: 'deliveryStage',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Delivery Stage' }],
      description: [{ languageCode: 'en', value: 'Current delivery stage: ORDER_CONFIRMED, SOURCING, ARRIVED, DISPATCHED, DELIVERED' }],
      options: [
        { value: 'ORDER_CONFIRMED', label: 'Order Confirmed' },
        { value: 'SOURCING', label: 'Sourcing' },
        { value: 'ARRIVED', label: 'Arrived' },
        { value: 'DISPATCHED', label: 'Dispatched' },
        { value: 'DELIVERED', label: 'Delivered' },
      ],
    },
    {
      name: 'trackingNumber',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Tracking Number' }],
      description: [{ languageCode: 'en', value: 'Courier tracking number (shown when stage is DISPATCHED or DELIVERED)' }],
    },
  ],
  Customer: [
    {
      name: 'phoneNumber',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'Phone Number' }],
      description: [{ languageCode: 'en', value: 'Customer phone number (Sri Lanka format)' }],
    },
    {
      name: 'phoneVerified',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'Phone Verified' }],
      description: [{ languageCode: 'en', value: 'Phone number has been verified via SMS OTP' }],
    },
  ],
};

export const config: VendureConfig = {
  apiOptions: {
    port: Number(process.env.VENDURE_PORT) || 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: 'bearer',
    sessionSecret: process.env.SESSION_SECRET || 'session-secret-change-in-production',
    requireVerification: false, // Can enable later for email verification
  },
  databaseOptions: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vendure',
    synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
    logging: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'schema'] : ['error'],
    migrations: [path.join(__dirname, '../migrations')],
  },
  paymentOptions: {
    paymentMethodHandlers: [
      payherePaymentHandler,
      codPaymentHandler,
    ],
  },
  shippingOptions: {
    shippingCalculators: [
      transExpressShippingCalculator,
    ],
  },
  customFields,
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      port: Number(process.env.VENDURE_PORT) || 3000,
    }),
    AdminPlugin.init({
      route: 'admin',
      port: Number(process.env.VENDURE_PORT) || 3000,
    }),
    EmailPlugin.init({
      devMode: process.env.NODE_ENV === 'development',
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      mailboxPort: 3003,
      handlers: {
        // Email handlers will be configured here
      },
      transport: {
        type: 'smtp',
        host: process.env.SMTP_HOST || 'localhost',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      },
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: process.env.EMAIL_FROM || 'noreply@signaturekits.xyz',
        fromName: 'Signature Kits',
      },
    }),
    BatchImportPlugin,
    TypesensePlugin,
    DeliveryStatusPlugin,
    CustomerSyncPlugin,
  ],
};

