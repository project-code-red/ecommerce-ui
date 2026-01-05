import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/services/api/orderApi";
import { Order, OrderStatus } from "@/types/order";

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => orderApi.getAll(),
  });
};

export const useOrder = (id: string) => {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, paymentMethod }: { addressId: string; paymentMethod: string }) =>
      orderApi.create(addressId, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

