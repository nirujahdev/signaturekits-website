/**
 * Navigation items for Supabase Data Admin UI
 * These will be registered with Vendure Admin UI
 */
export const supabaseNavItems = [
  {
    id: 'supabase-customers',
    label: 'Customers',
    routerLink: ['/extensions/supabase/customers'],
    icon: 'user',
  },
  {
    id: 'supabase-orders',
    label: 'Orders',
    routerLink: ['/extensions/supabase/orders'],
    icon: 'shopping-cart',
  },
  {
    id: 'supabase-batches',
    label: 'Batches',
    routerLink: ['/extensions/supabase/batches'],
    icon: 'package',
  },
  {
    id: 'supabase-delivery-tracking',
    label: 'Delivery Tracking',
    routerLink: ['/extensions/supabase/delivery-tracking'],
    icon: 'truck',
  },
  {
    id: 'supabase-otp-sessions',
    label: 'OTP Sessions',
    routerLink: ['/extensions/supabase/otp-sessions'],
    icon: 'lock',
  },
];

