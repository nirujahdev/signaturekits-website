import 'reflect-metadata';
import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
  .then(worker => {
    console.log('Vendure Worker started successfully');
  })
  .catch(err => {
    console.error('Error starting Vendure Worker:', err);
    process.exit(1);
  });

