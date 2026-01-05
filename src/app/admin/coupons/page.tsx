"use client";

import { useState } from "react";
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/services/queries/adminQueries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { Coupon } from "@/types/coupon";

export default function AdminCouponsPage() {
  const { data: coupons, isLoading } = useCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minPurchase: undefined as number | undefined,
    maxDiscount: undefined as number | undefined,
    applicableTo: "all" as "all" | "category" | "product",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usageLimit: undefined as number | undefined,
    description: "",
    isActive: true,
  });

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
        applicableTo: coupon.applicableTo,
        validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
        validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
        usageLimit: coupon.usageLimit,
        description: coupon.description || "",
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        minPurchase: undefined,
        maxDiscount: undefined,
        applicableTo: "all",
        validFrom: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        usageLimit: undefined,
        description: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code || formData.value <= 0) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const couponData = {
      ...formData,
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
    };

    if (editingCoupon) {
      updateCoupon.mutate(
        { id: editingCoupon.id, data: couponData },
        {
          onSuccess: () => {
            showToast("Coupon updated successfully", "success");
            setIsModalOpen(false);
            setEditingCoupon(null);
          },
          onError: () => {
            showToast("Failed to update coupon", "error");
          },
        }
      );
    } else {
      createCoupon.mutate(couponData, {
        onSuccess: () => {
          showToast("Coupon created successfully", "success");
          setIsModalOpen(false);
        },
        onError: () => {
          showToast("Failed to create coupon", "error");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon.mutate(id, {
        onSuccess: () => {
          showToast("Coupon deleted successfully", "success");
        },
      });
    }
  };

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Coupons & Offers</h1>
        <Button onClick={() => handleOpenModal()}>Add Coupon</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Min Purchase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons?.map((coupon) => {
                const isExpired = new Date(coupon.validUntil) < new Date();
                return (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                      {coupon.description && (
                        <div className="text-xs text-gray-500">{coupon.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="default">{coupon.type}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.minPurchase ? `₹${coupon.minPurchase}` : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(coupon.validUntil)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usedCount} / {coupon.usageLimit || "∞"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={coupon.isActive && !isExpired ? "success" : "default"}>
                        {isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(coupon)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
        }}
        title={editingCoupon ? "Edit Coupon" : "Add Coupon"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Coupon Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="WELCOME50"
            required
          />
          <Select
            label="Type"
            options={[
              { value: "percentage", label: "Percentage" },
              { value: "fixed", label: "Fixed Amount" },
            ]}
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" })
            }
          />
          <Input
            label={formData.type === "percentage" ? "Discount %" : "Discount Amount (₹)"}
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
            required
          />
          {formData.type === "percentage" && (
            <Input
              label="Max Discount (₹)"
              type="number"
              value={formData.maxDiscount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          )}
          <Input
            label="Min Purchase (₹)"
            type="number"
            value={formData.minPurchase || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minPurchase: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
          />
          <Select
            label="Applicable To"
            options={[
              { value: "all", label: "All Products" },
              { value: "category", label: "Category" },
              { value: "product", label: "Product" },
            ]}
            value={formData.applicableTo}
            onChange={(e) =>
              setFormData({
                ...formData,
                applicableTo: e.target.value as "all" | "category" | "product",
              })
            }
          />
          <Input
            label="Valid From"
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            required
          />
          <Input
            label="Valid Until"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            required
          />
          <Input
            label="Usage Limit"
            type="number"
            value={formData.usageLimit || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                usageLimit: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCoupon(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={createCoupon.isPending || updateCoupon.isPending}
            >
              {editingCoupon ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

