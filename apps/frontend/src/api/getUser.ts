import { User } from "@/store/user";

export const getUser = async (): Promise<null | User> => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
