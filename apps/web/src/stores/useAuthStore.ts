import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: "PATIENT" | "PROVIDER" | "ADMIN";
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      setToken: (token: string) => set({ accessToken: token }),
      setUser: (user: User) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
