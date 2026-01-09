import { Injectable } from '@nestjs/common';
import { JobQueueService, Job } from '@vendure/core';
import { TypesenseService } from '../plugins/typesense-service';

/**
 * Background job to sync products to Typesense
 * Runs periodically to keep search index up to date
 */
@Injectable()
export class TypesenseSyncJob {
  constructor(
    private jobQueueService: JobQueueService,
    private typesenseService: TypesenseService,
  ) {}

  async start() {
    // Schedule sync job to run every hour
    await this.jobQueueService.add({
      name: 'typesense-sync',
      work: async (job: Job) => {
        await this.typesenseService.syncAllProducts();
      },
      retries: 2,
    });

    // Schedule recurring job (every hour)
    setInterval(async () => {
      await this.jobQueueService.add({
        name: 'typesense-sync',
        work: async (job: Job) => {
          await this.typesenseService.syncAllProducts();
        },
        retries: 2,
      });
    }, 60 * 60 * 1000); // 1 hour
  }
}

