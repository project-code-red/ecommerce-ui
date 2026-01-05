export const ORDER_STATUS_COLORS: Record<
  string,
  'default' | 'success' | 'warning' | 'danger' | 'info'
> = {
  order_placed: 'info',
  packed: 'info',
  shipped: 'info',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'warning',
  refund_completed: 'success',
};

export const ORDER_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'order_placed', label: 'Order Placed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
  { value: 'refund_completed', label: 'Refund Completed' },
];

export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
];

export const ADMIN_ROLES = ['super_admin', 'admin', 'staff'] as const;

export const DEFAULT_PAGE_SIZE = 20;

