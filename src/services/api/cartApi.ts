import { Cart, CartItem } from "@/types/cart";
import { productApi } from "./productApi";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory cart storage (in real app, this would be on server)
let cartData: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  delivery: 50,
  total: 0,
};

export const cartApi = {
  get: async (): Promise<Cart> => {
    await delay(200);
    return { ...cartData };
  },

  addItem: async (productId: string, quantity: number, size?: string, color?: string): Promise<Cart> => {
    await delay(300);
    const product = await productApi.getById(productId);
    
    const existingItemIndex = cartData.items.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    );

    if (existingItemIndex >= 0) {
      cartData.items[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0],
          price: product.price,
          mrp: product.mrp,
        },
        quantity,
        size,
        color,
        price: product.price,
      };
      cartData.items.push(newItem);
    }

    return cartApi.calculateTotals();
  },

  updateQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
    await delay(200);
    const item = cartData.items.find((i) => i.id === itemId);
    if (!item) {
      throw new Error("Cart item not found");
    }
    if (quantity <= 0) {
      cartData.items = cartData.items.filter((i) => i.id !== itemId);
    } else {
      item.quantity = quantity;
    }
    return cartApi.calculateTotals();
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    await delay(200);
    cartData.items = cartData.items.filter((i) => i.id !== itemId);
    return cartApi.calculateTotals();
  },

  clear: async (): Promise<Cart> => {
    await delay(200);
    cartData.items = [];
    return cartApi.calculateTotals();
  },

  applyCoupon: async (code: string): Promise<Cart> => {
    await delay(300);
    // Mock coupon validation
    if (code === "SAVE150" && cartData.subtotal >= 1000) {
      cartData.couponCode = code;
      cartData.couponDiscount = 150;
    } else if (code === "WELCOME50" && cartData.subtotal >= 500) {
      cartData.couponCode = code;
      cartData.couponDiscount = Math.min(cartData.subtotal * 0.1, 500);
    } else {
      throw new Error("Invalid or inapplicable coupon code");
    }
    return cartApi.calculateTotals();
  },

  removeCoupon: async (): Promise<Cart> => {
    await delay(200);
    cartData.couponCode = undefined;
    cartData.couponDiscount = undefined;
    return cartApi.calculateTotals();
  },

  calculateTotals: async (): Promise<Cart> => {
    cartData.subtotal = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartData.discount = cartData.couponDiscount || 0;
    cartData.delivery = cartData.subtotal > 500 ? 0 : 50;
    cartData.total = cartData.subtotal - cartData.discount + cartData.delivery;
    return { ...cartData };
  },
};

