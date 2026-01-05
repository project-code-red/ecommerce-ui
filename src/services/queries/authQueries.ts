import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/api/authApi";
import { LoginInput, RegisterInput } from "@/schemas/authSchemas";
import { AuthUser, User } from "@/types/user";
import { getCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";

export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    initialData: () => {
      const authUser = getCurrentUser();
      if (!authUser) return null;
      // Return a mock user object based on auth user
      return {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        phone: authUser.phone,
        role: authUser.role,
        addresses: [],
        paymentMethods: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (response) => {
      // Update auth store immediately
      setUser(response.user);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (response) => {
      // Update auth store immediately
      setUser(response.user);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all query cache
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
      // Update auth store
      logoutStore();
    },
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: () => authApi.googleLogin(),
    onSuccess: (response) => {
      // Update auth store immediately
      setUser(response.user);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useOtpLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp?: string }) =>
      authApi.otpLogin(phone, otp),
    onSuccess: (data) => {
      if ("user" in data) {
        // Update auth store immediately
        setUser(data.user);
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });
};

