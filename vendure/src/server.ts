import 'reflect-metadata';
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
  .then(app => {
    // Access the underlying Express app for custom routes
    const httpServer = app.httpServer;
    
    // PayHere webhook endpoint
    // Note: This will be handled via a plugin or separate Express server
    // For now, webhook handling should be done in Next.js API routes
    
    console.log(`Vendure Server running at http://localhost:${config.apiOptions.port}`);
    console.log(`Admin UI: http://localhost:${config.apiOptions.port}/admin`);
    console.log(`Shop API: http://localhost:${config.apiOptions.port}/shop-api`);
    console.log(`Admin API: http://localhost:${config.apiOptions.port}/admin-api`);
    console.log(`\nNote: PayHere webhooks should be handled in Next.js API routes`);
    console.log(`Webhook URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/payhere/webhook`);
  })
  .catch(err => {
    console.error('Error starting Vendure Server:', err);
    process.exit(1);
  });
