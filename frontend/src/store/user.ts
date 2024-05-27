import { create } from "zustand";
import user from "../assets/user.png";

export type User = {
  name: string | undefined;
  image: string | undefined;
  token: string | undefined;
};

type Actions = {
  setUser: (user: UserStore) => void;
};

type UserStore = {
  user: User;
};

export const userStore = create<UserStore & Actions>((set) => ({
  user: {
    name: undefined,
    image: user,
    token: undefined,
  },
  setUser({ user }: UserStore) {
    set({
      user: { ...user, name: user.name, image: user.image, token: user.token },
    });
  },
}));
