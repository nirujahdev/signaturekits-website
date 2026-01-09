import path from 'path';
import { VendureConfig } from '@vendure/core';
import { AdminPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { EmailPlugin } from '@vendure/email-plugin';

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
      name: 'whatsappNumber',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'WhatsApp Number' }],
      description: [{ languageCode: 'en', value: 'Customer WhatsApp number in E.164 format' }],
    },
    {
      name: 'whatsappOptIn',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'WhatsApp Opt-In' }],
      description: [{ languageCode: 'en', value: 'Customer has opted in to WhatsApp communications' }],
    },
    {
      name: 'whatsappVerified',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'WhatsApp Verified' }],
      description: [{ languageCode: 'en', value: 'WhatsApp number has been verified via OTP' }],
    },
  ],
  Customer: [
    {
      name: 'whatsappNumber',
      type: 'string',
      nullable: true,
      label: [{ languageCode: 'en', value: 'WhatsApp Number' }],
      description: [{ languageCode: 'en', value: 'Customer WhatsApp number in E.164 format' }],
    },
    {
      name: 'whatsappOptIn',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'WhatsApp Opt-In' }],
      description: [{ languageCode: 'en', value: 'Customer has opted in to WhatsApp communications' }],
    },
    {
      name: 'whatsappVerified',
      type: 'boolean',
      defaultValue: false,
      label: [{ languageCode: 'en', value: 'WhatsApp Verified' }],
      description: [{ languageCode: 'en', value: 'WhatsApp number has been verified via OTP' }],
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
      // PayHere payment handler will be added here
      // COD payment handler will be added here
    ],
  },
  shippingOptions: {
    shippingCalculators: [
      // Trans Express shipping calculator will be added here
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
  ],
};

