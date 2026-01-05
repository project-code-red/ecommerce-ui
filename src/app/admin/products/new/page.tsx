"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "@/schemas/productSchemas";
import { useCreateProduct } from "@/services/queries/adminQueries";
import { useCategories } from "@/services/queries/adminQueries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { X } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories();
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      images: [],
      price: 0,
      mrp: 0,
      stock: 0,
      category: "",
      subCategory: "",
      subSubCategory: "",
      variants: {},
      deliveryEstimate: "3-5 days",
      returnInfo: "10-day return",
      codAvailable: true,
      isActive: true,
    },
  });

  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");

  const selectedCategoryData = categories?.find((c) => c.slug === selectedCategory);
  const selectedSubCategoryData = selectedCategoryData?.subCategories.find(
    (s) => s.slug === selectedSubCategory
  );

  const handleAddImage = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setValue("images", newUrls.filter((url) => url.trim() !== ""));
  };

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setValue("images", newUrls.filter((url) => url.trim() !== ""));
  };

  const handleAddSize = () => {
    if (newSize.trim()) {
      const updated = [...sizes, newSize.trim()];
      setSizes(updated);
      setValue("variants.sizes", updated);
      setNewSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    const updated = sizes.filter((s) => s !== size);
    setSizes(updated);
    setValue("variants.sizes", updated);
  };

  const handleAddColor = () => {
    if (newColor.trim()) {
      const updated = [...colors, newColor.trim()];
      setColors(updated);
      setValue("variants.colors", updated);
      setNewColor("");
    }
  };

  const handleRemoveColor = (color: string) => {
    const updated = colors.filter((c) => c !== color);
    setColors(updated);
    setValue("variants.colors", updated);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const updated = [...features, newFeature.trim()];
      setFeatures(updated);
      setValue("features", updated);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    const updated = features.filter((f) => f !== feature);
    setFeatures(updated);
    setValue("features", updated);
  };

  const onSubmit = (data: ProductInput) => {
    const productData = {
      ...data,
      discountPercentage: data.mrp > data.price ? Math.round(((data.mrp - data.price) / data.mrp) * 100) : 0,
      variants: {
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined,
      },
      features: features.length > 0 ? features : undefined,
    };

    createProduct.mutate(productData, {
      onSuccess: () => {
        showToast("Product created successfully", "success");
        router.push("/admin/products");
      },
      onError: () => {
        showToast("Failed to create product", "error");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create Product</h1>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <Input
            label="Product Name"
            {...register("name")}
            error={errors.name?.message}
            required
          />
          <Textarea
            label="Description"
            {...register("description")}
            error={errors.description?.message}
            rows={4}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              error={errors.price?.message}
              required
            />
            <Input
              label="MRP (₹)"
              type="number"
              step="0.01"
              {...register("mrp", { valueAsNumber: true })}
              error={errors.mrp?.message}
              required
            />
          </div>

          <Input
            label="Stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            error={errors.stock?.message}
            required
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Category</h2>
          <Select
            label="Main Category"
            options={categories?.map((c) => ({ value: c.slug, label: c.name })) || []}
            value={selectedCategory}
            onChange={(e) => {
              setValue("category", e.target.value);
              setValue("subCategory", "");
              setValue("subSubCategory", "");
            }}
            required
          />
          {selectedCategoryData && (
            <Select
              label="Sub Category"
              options={selectedCategoryData.subCategories.map((s) => ({
                value: s.slug,
                label: s.name,
              }))}
              value={selectedSubCategory}
              onChange={(e) => {
                setValue("subCategory", e.target.value);
                setValue("subSubCategory", "");
              }}
              required
            />
          )}
          {selectedSubCategoryData?.subSubCategories && selectedSubCategoryData.subSubCategories.length > 0 && (
            <Select
              label="Sub Sub Category"
              options={selectedSubCategoryData.subSubCategories.map((s) => ({
                value: s.slug,
                label: s.name,
              }))}
              value={watch("subSubCategory")}
              onChange={(e) => setValue("subSubCategory", e.target.value)}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Images</h2>
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Image URL"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddImage}>
            Add Image
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Variants</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Sizes</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="e.g., S, M, L, XL"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSize}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="e.g., Black, Blue, Red"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddColor}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Features</h2>
          <div className="flex space-x-2 mb-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddFeature}>
              Add
            </Button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <Input
            label="Delivery Estimate"
            {...register("deliveryEstimate")}
            placeholder="e.g., 3-5 days"
          />
          <Input
            label="Return Info"
            {...register("returnInfo")}
            placeholder="e.g., 10-day return"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="codAvailable"
              {...register("codAvailable")}
              className="rounded"
            />
            <label htmlFor="codAvailable" className="text-sm font-medium">
              COD Available
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active (Visible to customers)
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createProduct.isPending}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}

