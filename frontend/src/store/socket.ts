import { create } from "zustand";

type SocketStore = {
  socket: WebSocket | null;
  setSocket: () => void;
};

export const socketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket() {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      set({ socket: ws });
    };
    ws.onclose = () => {
      set({ socket: null });
    };
  },
}));
