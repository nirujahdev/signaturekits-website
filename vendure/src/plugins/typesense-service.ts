import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus, ProductService, ProductVariantService } from '@vendure/core';
import Typesense from 'typesense';

export interface TypesenseProduct {
  id: string;
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currencyCode: string;
  sku: string;
  stockLevel: string;
  image: string;
  team?: string;
  season?: string;
  type?: string;
  category?: string;
  size?: string;
  facetValues?: string[];
}

@Injectable()
export class TypesenseService implements OnModuleInit {
  private client: Typesense.Client | null = null;
  private collectionName = 'products';

  constructor(
    private productService: ProductService,
    private productVariantService: ProductVariantService,
    private eventBus: EventBus,
  ) {}

  async onModuleInit() {
    this.initializeClient();
    await this.createCollection();
    // Sync existing products on startup
    await this.syncAllProducts();
  }

  private initializeClient() {
    const host = process.env.TYPESENSE_HOST;
    const port = process.env.TYPESENSE_PORT || '443';
    const protocol = process.env.TYPESENSE_PROTOCOL || 'https';
    const apiKey = process.env.TYPESENSE_API_KEY;

    if (!host || !apiKey) {
      console.warn('Typesense not configured. Search will be disabled.');
      return;
    }

    this.client = new Typesense.Client({
      nodes: [
        {
          host,
          port: parseInt(port),
          protocol: protocol as 'http' | 'https',
        },
      ],
      apiKey,
      connectionTimeoutSeconds: 2,
    });
  }

  private async createCollection() {
    if (!this.client) return;

    try {
      // Check if collection exists
      const collections = await this.client.collections().retrieve();
      const exists = collections.collections.some(
        (c) => c.name === this.collectionName
      );

      if (exists) {
        console.log(`Typesense collection "${this.collectionName}" already exists`);
        return;
      }

      // Create collection schema
      const schema = {
        name: this.collectionName,
        fields: [
          { name: 'id', type: 'string' },
          { name: 'productId', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'slug', type: 'string' },
          { name: 'description', type: 'string', optional: true },
          { name: 'price', type: 'float' },
          { name: 'currencyCode', type: 'string' },
          { name: 'sku', type: 'string' },
          { name: 'stockLevel', type: 'string' },
          { name: 'image', type: 'string', optional: true },
          { name: 'team', type: 'string', optional: true, facet: true },
          { name: 'season', type: 'string', optional: true, facet: true },
          { name: 'type', type: 'string', optional: true, facet: true },
          { name: 'category', type: 'string', optional: true, facet: true },
          { name: 'size', type: 'string', optional: true, facet: true },
          { name: 'facetValues', type: 'string[]', optional: true, facet: true },
        ],
        default_sorting_field: 'name',
      };

      await this.client.collections().create(schema);
      console.log(`Typesense collection "${this.collectionName}" created`);
    } catch (error: any) {
      if (error.httpStatus === 409) {
        console.log(`Typesense collection "${this.collectionName}" already exists`);
      } else {
        console.error('Error creating Typesense collection:', error);
      }
    }
  }

  async syncProduct(productId: string) {
    if (!this.client) return;

    try {
      const product = await this.productService.findOne(
        { id: productId },
        ['variants', 'featuredAsset', 'assets', 'facetValues', 'facetValues.facet']
      );

      if (!product) return;

      // Index each variant as a separate document
      for (const variant of product.variants) {
        const document: TypesenseProduct = {
          id: variant.id.toString(),
          productId: product.id.toString(),
          name: product.name,
          slug: product.slug || '',
          description: product.description || '',
          price: variant.priceWithTax || 0,
          currencyCode: variant.currencyCode || 'LKR',
          sku: variant.sku || '',
          stockLevel: variant.stockLevel || 'OUT_OF_STOCK',
          image: product.featuredAsset?.preview || '',
          team: (product.customFields as any)?.team,
          season: (product.customFields as any)?.season,
          type: (product.customFields as any)?.type,
          category: (product.customFields as any)?.category,
          size: variant.name,
          facetValues: product.facetValues.map((fv) => fv.code),
        };

        await this.client
          .collections(this.collectionName)
          .documents()
          .upsert(document);
      }
    } catch (error) {
      console.error(`Error syncing product ${productId}:`, error);
    }
  }

  async deleteProduct(productId: string) {
    if (!this.client) return;

    try {
      // Delete all variants of this product
      const searchResults = await this.client
        .collections(this.collectionName)
        .documents()
        .search({
          q: '*',
          filter_by: `productId:${productId}`,
        });

      for (const hit of searchResults.hits || []) {
        await this.client
          .collections(this.collectionName)
          .documents(hit.document.id)
          .delete();
      }
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
    }
  }

  async syncAllProducts() {
    if (!this.client) {
      console.warn('Typesense client not initialized. Skipping sync.');
      return;
    }

    try {
      console.log('Starting Typesense product sync...');
      const products = await this.productService.findAll({ take: 1000 });

      for (const product of products.items) {
        await this.syncProduct(product.id.toString());
      }

      console.log(`Synced ${products.items.length} products to Typesense`);
    } catch (error) {
      console.error('Error syncing all products:', error);
    }
  }

  async search(query: string, filters?: Record<string, any>) {
    if (!this.client) {
      return { hits: [], found: 0 };
    }

    try {
      const searchParameters: any = {
        q: query,
        query_by: 'name,description,team,season',
        per_page: 20,
      };

      if (filters) {
        const filterBy: string[] = [];
        if (filters.team) filterBy.push(`team:${filters.team}`);
        if (filters.season) filterBy.push(`season:${filters.season}`);
        if (filters.type) filterBy.push(`type:${filters.type}`);
        if (filters.category) filterBy.push(`category:${filters.category}`);
        if (filters.size) filterBy.push(`size:${filters.size}`);
        if (filterBy.length > 0) {
          searchParameters.filter_by = filterBy.join(' && ');
        }
      }

      const results = await this.client
        .collections(this.collectionName)
        .documents()
        .search(searchParameters);

      return results;
    } catch (error) {
      console.error('Typesense search error:', error);
      return { hits: [], found: 0 };
    }
  }
}

