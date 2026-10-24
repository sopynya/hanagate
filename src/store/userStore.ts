import { create } from "zustand";

interface UStore {
    language: string;
    setLanguage: (lang: string) => void;
}

export const useUStore = create<UStore>((set, get) => ({
    language: 'eng',

    setLanguage: (lang: string) => {
        set({language: lang})
    },
}))