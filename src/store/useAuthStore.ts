import { create } from "zustand";
import { AuthUser } from "@/types/user";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,
  initialize: () => {
    if (typeof window !== "undefined") {
      const user = getCurrentUser();
      set({ user, isAuthenticated: user !== null, initialized: true });
    }
  },
  setUser: (user) => {
    setCurrentUser(user);
    set({ user, isAuthenticated: user !== null, initialized: true });
  },
  logout: () => {
    setCurrentUser(null);
    set({ user: null, isAuthenticated: false, initialized: true });
  },
}));

