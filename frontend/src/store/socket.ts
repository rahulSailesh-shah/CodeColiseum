import { create } from "zustand";

type SocketStore = {
    socket: WebSocket | null;
};

type Action = {
    setSocket: (firstName: SocketStore["socket"]) => void;
};

export const socketStore = create<SocketStore & Action>((set) => ({
    socket: null,
    setSocket: (socket) => set({ socket }),
}));
