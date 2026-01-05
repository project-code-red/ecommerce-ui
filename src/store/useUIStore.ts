import { create } from "zustand";

interface UIState {
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  notificationDrawerOpen: boolean;
  searchOpen: boolean;
  activeModal: string | null;
  theme: "light" | "dark";
  toggleMobileMenu: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openNotificationDrawer: () => void;
  closeNotificationDrawer: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setActiveModal: (modal: string | null) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  notificationDrawerOpen: false,
  searchOpen: false,
  activeModal: null,
  theme: "light",
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  openNotificationDrawer: () => set({ notificationDrawerOpen: true }),
  closeNotificationDrawer: () => set({ notificationDrawerOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setTheme: (theme) => set({ theme }),
}));

