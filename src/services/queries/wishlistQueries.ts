import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/services/api/wishlistApi";
import { Product } from "@/types/product";

export const useWishlist = () => {
  return useQuery<Product[]>({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.get(),
  });
};

export const useIsInWishlist = (productId: string) => {
  return useQuery<boolean>({
    queryKey: ["wishlist", "check", productId],
    queryFn: () => wishlistApi.isInWishlist(productId),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

