import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/api/cartApi";
import { Cart } from "@/types/cart";

export const useCart = () => {
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => cartApi.get(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
      size,
      color,
    }: {
      productId: string;
      quantity: number;
      size?: string;
      color?: string;
    }) => cartApi.addItem(productId, quantity, size, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

