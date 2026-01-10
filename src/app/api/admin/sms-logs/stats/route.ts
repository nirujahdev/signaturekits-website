import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/sms-logs/stats
 * Get SMS statistics
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    // Get all logs in period
    const { data: logs, error } = await supabase
      .from('sms_logs')
      .select('status, message_type, cost')
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching SMS stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch SMS statistics' },
        { status: 500 }
      );
    }

    const stats = {
      total_sent: logs?.filter(l => l.status === 'sent').length || 0,
      total_failed: logs?.filter(l => l.status === 'failed').length || 0,
      total_pending: logs?.filter(l => l.status === 'pending').length || 0,
      total_cost: logs?.reduce((sum, l) => sum + (parseFloat(l.cost || '0') || 0), 0) || 0,
      by_type: {
        otp: logs?.filter(l => l.message_type === 'otp' && l.status === 'sent').length || 0,
        order_confirmation: logs?.filter(l => l.message_type === 'order_confirmation' && l.status === 'sent').length || 0,
        delivery_update: logs?.filter(l => l.message_type === 'delivery_update' && l.status === 'sent').length || 0,
        custom: logs?.filter(l => l.message_type === 'custom' && l.status === 'sent').length || 0,
      },
    };

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('SMS stats API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

