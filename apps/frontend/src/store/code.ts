import { create } from "zustand";

type CodeStore = {
  code: string | undefined;
};

type Action = {
  setCode: (code: CodeStore["code"]) => void;
};

export const codeStore = create<CodeStore & Action>((set) => ({
  code: "",
  setCode: (code) => set({ code }),
}));
