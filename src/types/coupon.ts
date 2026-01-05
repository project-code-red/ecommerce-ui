export type CouponType = "percentage" | "fixed";
export type CouponApplicableTo = "all" | "category" | "product";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  applicableTo: CouponApplicableTo;
  applicableIds?: string[];
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
}

