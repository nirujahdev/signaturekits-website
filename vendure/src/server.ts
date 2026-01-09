import 'reflect-metadata';
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
  .then(app => {
    console.log(`Vendure Server running at http://localhost:${config.apiOptions.port}`);
    console.log(`Admin UI: http://localhost:${config.apiOptions.port}/admin`);
    console.log(`Shop API: http://localhost:${config.apiOptions.port}/shop-api`);
    console.log(`Admin API: http://localhost:${config.apiOptions.port}/admin-api`);
  })
  .catch(err => {
    console.error('Error starting Vendure Server:', err);
    process.exit(1);
  });

