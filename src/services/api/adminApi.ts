import { Product } from "@/types/product";
import { Order, OrderStatus } from "@/types/order";
import { User } from "@/types/user";
import { Banner } from "@/types/banner";
import { Coupon } from "@/types/coupon";
import { Category } from "@/types/category";
import { productApi } from "./productApi";
import { orders } from "@/mock/orders";
import { users } from "@/mock/users";
import { banners } from "@/mock/banners";
import { coupons } from "@/mock/coupons";
import { categories } from "@/mock/categories";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminApi = {
  // Dashboard stats
  getStats: async () => {
    await delay(300);
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => ["order_placed", "packed", "shipped"].includes(o.status)).length,
      activeProducts: (await productApi.getAll()).data.filter((p) => p.isActive).length,
      totalUsers: users.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.status === "delivered" ? o.total : 0), 0),
    };
  },

  // Products
  getProducts: async (page = 1, limit = 20, search?: string) => {
    await delay(300);
    let filtered = (await productApi.getAll()).data;
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    const start = (page - 1) * limit;
    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  createProduct: async (data: Partial<Product>) => {
    return productApi.create(data);
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    return productApi.update(id, data);
  },

  deleteProduct: async (id: string) => {
    return productApi.delete(id);
  },

  // Orders
  getOrders: async (page = 1, limit = 20, status?: OrderStatus) => {
    await delay(300);
    let filtered = [...orders];
    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }
    const start = (page - 1) * limit;
    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  getOrder: async (id: string) => {
    await delay(200);
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    await delay(300);
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
    });
    order.updatedAt = new Date().toISOString();
    return order;
  },

  // Categories
  getCategories: async () => {
    await delay(200);
    return categories;
  },

  createCategory: async (data: Category) => {
    await delay(300);
    categories.push(data);
    return data;
  },

  updateCategory: async (slug: string, data: Partial<Category>) => {
    await delay(300);
    const index = categories.findIndex((c) => c.slug === slug);
    if (index === -1) throw new Error("Category not found");
    categories[index] = { ...categories[index], ...data };
    return categories[index];
  },

  // Banners
  getBanners: async () => {
    await delay(200);
    return banners;
  },

  createBanner: async (data: Partial<Banner>) => {
    await delay(300);
    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      title: data.title || "",
      image: data.image || "",
      link: data.link,
      linkText: data.linkText,
      isActive: data.isActive ?? true,
      order: data.order || banners.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    banners.push(newBanner);
    return newBanner;
  },

  updateBanner: async (id: string, data: Partial<Banner>) => {
    await delay(300);
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");
    banners[index] = { ...banners[index], ...data, updatedAt: new Date().toISOString() };
    return banners[index];
  },

  deleteBanner: async (id: string) => {
    await delay(300);
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Banner not found");
    banners.splice(index, 1);
  },

  // Coupons
  getCoupons: async () => {
    await delay(200);
    return coupons;
  },

  createCoupon: async (data: Partial<Coupon>) => {
    await delay(300);
    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: data.code || "",
      type: data.type || "percentage",
      value: data.value || 0,
      minPurchase: data.minPurchase,
      maxDiscount: data.maxDiscount,
      applicableTo: data.applicableTo || "all",
      applicableIds: data.applicableIds,
      validFrom: data.validFrom as string || new Date().toISOString(),
      validUntil: data.validUntil as string || new Date().toISOString(),
      usageLimit: data.usageLimit,
      usedCount: 0,
      isActive: data.isActive ?? true,
      description: data.description,
    };
    coupons.push(newCoupon);
    return newCoupon;
  },

  updateCoupon: async (id: string, data: Partial<Coupon>) => {
    await delay(300);
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Coupon not found");
    coupons[index] = { ...coupons[index], ...data };
    return coupons[index];
  },

  deleteCoupon: async (id: string) => {
    await delay(300);
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Coupon not found");
    coupons.splice(index, 1);
  },

  // Users
  getUsers: async () => {
    await delay(300);
    return users;
  },

  updateUserRole: async (id: string, role: User["role"]) => {
    await delay(300);
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    user.role = role;
    user.updatedAt = new Date().toISOString();
    return user;
  },
};

