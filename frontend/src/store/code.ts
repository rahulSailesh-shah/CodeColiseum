import { create } from "zustand";

type CodeStore = {
    code: string | undefined;
};

type Action = {
    setCode: (firstName: CodeStore["code"]) => void;
};

export const codeStore = create<CodeStore & Action>((set) => ({
    code: "",
    setCode: (code) => set({ code }),
}));
