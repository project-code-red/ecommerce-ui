"use client";

import { useState } from "react";
import { useCategories, useCreateCategory } from "@/services/queries/adminQueries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";
import { Category, SubCategory, SubSubCategory } from "@/types/category";
import { Modal } from "@/components/ui/Modal";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const handleCreateCategory = () => {
    if (!formData.name || !formData.slug) {
      showToast("Please fill all fields", "error");
      return;
    }

    const newCategory: Category = {
      name: formData.name,
      slug: formData.slug,
      subCategories: [],
    };

    createCategory.mutate(newCategory, {
      onSuccess: () => {
        showToast("Category created successfully", "success");
        setIsModalOpen(false);
        setFormData({ name: "", slug: "" });
      },
      onError: () => {
        showToast("Failed to create category", "error");
      },
    });
  };

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories?.map((category) => (
                <tr key={category.slug}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {category.subCategories.map((sub) => (
                        <Badge key={sub.slug} variant="default">
                          {sub.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Category">
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Men, Women"
          />
          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., men, women"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} isLoading={createCategory.isPending}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

