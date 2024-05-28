// userStore.ts
import { create } from "zustand";

export interface User {
  token: string;
  image: string;
  name: string;
}

interface UserState {
  user: User | null | undefined;
  fetchUser: () => Promise<void>;
  logOut: () => void;
}

export const userStore = create<UserState>((set) => ({
  user: null,
  logOut: async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    set({ user: null });
  },
  fetchUser: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        set({ user: data });
      } else {
        set({ user: null });
      }
    } catch (e) {
      set({ user: undefined });
    }
  },
}));
