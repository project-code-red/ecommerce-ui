import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/services/api/productApi";
import { Product, ProductFilters } from "@/types/product";
import { PaginatedResponse } from "@/types/common";

export const useProducts = (filters?: ProductFilters, page = 1, limit = 20) => {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", filters, page, limit],
    queryFn: () => productApi.getAll(filters, page, limit),
  });
};

export const useProduct = (slug: string) => {
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useProductById = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

