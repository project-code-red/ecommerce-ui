export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    mrp: number;
  };
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
}

