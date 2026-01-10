import { getAdminSupabaseClient } from './admin-supabase';

// Typesense client setup (you'll need to install typesense-js)
// import Typesense from 'typesense';

export type SyncType = 'product' | 'collection' | 'full';
export type SyncStatus = 'success' | 'failed' | 'pending';
export type SyncAction = 'create' | 'update' | 'delete';

export interface SyncLogData {
  sync_type: SyncType;
  entity_id?: string;
  status: SyncStatus;
  action: SyncAction;
  error_message?: string;
  synced_at?: Date;
}

/**
 * Log Typesense sync operation
 */
export async function logTypesenseSync(data: SyncLogData): Promise<string> {
  try {
    const supabase = getAdminSupabaseClient();
    
    const logEntry = {
      sync_type: data.sync_type,
      entity_id: data.entity_id || null,
      status: data.status,
      action: data.action,
      error_message: data.error_message || null,
      synced_at: data.synced_at ? data.synced_at.toISOString() : new Date().toISOString(),
    };

    const { data: inserted, error } = await supabase
      .from('typesense_sync_logs')
      .insert(logEntry)
      .select('id')
      .single();

    if (error) {
      console.error('Error logging Typesense sync:', error);
      throw error;
    }

    return inserted.id;
  } catch (error) {
    console.error('Error in Typesense sync logger:', error);
    throw error;
  }
}

/**
 * Update sync log status
 */
export async function updateTypesenseSyncStatus(
  logId: string,
  status: SyncStatus,
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = getAdminSupabaseClient();
    
    const { error } = await supabase
      .from('typesense_sync_logs')
      .update({
        status,
        error_message: errorMessage || null,
        synced_at: status === 'success' ? new Date().toISOString() : null,
      })
      .eq('id', logId);

    if (error) {
      console.error('Error updating Typesense sync log:', error);
    }
  } catch (error) {
    console.error('Error updating Typesense sync log status:', error);
  }
}

/**
 * Sync a single product to Typesense
 */
export async function syncProduct(productId: string): Promise<void> {
  const logId = await logTypesenseSync({
    sync_type: 'product',
    entity_id: productId,
    status: 'pending',
    action: 'update',
  });

  try {
    // TODO: Implement actual Typesense sync
    // const typesenseClient = new Typesense.Client({...});
    // const product = await getProductFromSupabase(productId);
    // await typesenseClient.collections('products').documents().upsert(product);

    await updateTypesenseSyncStatus(logId, 'success');
  } catch (error: any) {
    await updateTypesenseSyncStatus(logId, 'failed', error.message);
    throw error;
  }
}

/**
 * Sync all products to Typesense
 */
export async function syncAllProducts(): Promise<void> {
  const logId = await logTypesenseSync({
    sync_type: 'full',
    status: 'pending',
    action: 'update',
  });

  try {
    // TODO: Implement full product sync
    // const products = await getAllProductsFromSupabase();
    // await typesenseClient.collections('products').documents().import(products);

    await updateTypesenseSyncStatus(logId, 'success');
  } catch (error: any) {
    await updateTypesenseSyncStatus(logId, 'failed', error.message);
    throw error;
  }
}

/**
 * Check last sync status
 */
export async function checkSyncStatus(): Promise<{
  last_sync: string | null;
  last_success: string | null;
  last_failure: string | null;
  pending_count: number;
  failed_count: number;
}> {
  try {
    const supabase = getAdminSupabaseClient();

    // Get last sync
    const { data: lastSync } = await supabase
      .from('typesense_sync_logs')
      .select('synced_at, status')
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();

    // Get last success
    const { data: lastSuccess } = await supabase
      .from('typesense_sync_logs')
      .select('synced_at')
      .eq('status', 'success')
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();

    // Get last failure
    const { data: lastFailure } = await supabase
      .from('typesense_sync_logs')
      .select('synced_at')
      .eq('status', 'failed')
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();

    // Get counts
    const { count: pendingCount } = await supabase
      .from('typesense_sync_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: failedCount } = await supabase
      .from('typesense_sync_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    return {
      last_sync: lastSync?.synced_at || null,
      last_success: lastSuccess?.synced_at || null,
      last_failure: lastFailure?.synced_at || null,
      pending_count: pendingCount || 0,
      failed_count: failedCount || 0,
    };
  } catch (error) {
    console.error('Error checking sync status:', error);
    throw error;
  }
}

