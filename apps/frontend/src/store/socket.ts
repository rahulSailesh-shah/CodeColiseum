import { create } from "zustand";
import { useUserStore } from ".";

type SocketStore = {
  socket: WebSocket | null;
  setSocket: () => void;
};

export const socketStore = create<SocketStore>((set) => ({
  socket: null,
  async setSocket() {
    const user = useUserStore.getState().user;
    if (!user) return;

    const ws = new WebSocket(`ws://localhost:8080/?userToken=${user.token}`);

    ws.onopen = () => {
      set({ socket: ws });
    };

    ws.onclose = () => {
      set({ socket: null });
    };
  },
}));
