import { AuthUser } from "@/types/user";

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: AuthUser | null): void => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    if (user.token) {
      localStorage.setItem("token", user.token);
    }
  } else {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const hasRole = (roles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return roles.includes(user.role);
};

export const isAdmin = (): boolean => {
  return hasRole(["super_admin", "admin", "staff"]);
};

