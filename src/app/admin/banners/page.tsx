"use client";

import { useState } from "react";
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "@/services/queries/adminQueries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import { Banner } from "@/types/banner";

export default function AdminBannersPage() {
  const { data: banners, isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    linkText: "Shop Now",
    isActive: true,
    order: 1,
  });

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        image: banner.image,
        link: banner.link || "",
        linkText: banner.linkText || "Shop Now",
        isActive: banner.isActive,
        order: banner.order,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        image: "",
        link: "",
        linkText: "Shop Now",
        isActive: true,
        order: (banners?.length || 0) + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.image) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (editingBanner) {
      updateBanner.mutate(
        { id: editingBanner.id, data: formData },
        {
          onSuccess: () => {
            showToast("Banner updated successfully", "success");
            setIsModalOpen(false);
            setEditingBanner(null);
          },
          onError: () => {
            showToast("Failed to update banner", "error");
          },
        }
      );
    } else {
      createBanner.mutate(formData, {
        onSuccess: () => {
          showToast("Banner created successfully", "success");
          setIsModalOpen(false);
        },
        onError: () => {
          showToast("Failed to create banner", "error");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteBanner.mutate(id, {
        onSuccess: () => {
          showToast("Banner deleted successfully", "success");
        },
      });
    }
  };

  const handleToggleActive = (banner: Banner) => {
    updateBanner.mutate(
      { id: banner.id, data: { isActive: !banner.isActive } },
      {
        onSuccess: () => {
          showToast("Banner status updated", "success");
        },
      }
    );
  };

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Button onClick={() => handleOpenModal()}>Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners?.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={banner.isActive ? "success" : "default"}>
                  {banner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{banner.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Order: {banner.order}</p>
              {banner.link && (
                <p className="text-sm text-gray-600 mb-4">Link: {banner.link}</p>
              )}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(banner)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(banner)}
                >
                  {banner.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(banner.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        title={editingBanner ? "Edit Banner" : "Add Banner"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Banner title"
            required
          />
          <Input
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />
          <Input
            label="Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="/products or /categories/men"
          />
          <Input
            label="Link Text"
            value={formData.linkText}
            onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
            placeholder="Shop Now"
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
          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBanner(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={createBanner.isPending || updateBanner.isPending}
            >
              {editingBanner ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

