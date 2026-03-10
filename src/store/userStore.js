import { create } from "zustand";

export const useUserStore = create((set, get) => ({
    username: null,
    name: null,
    avatar: '/bg.jpg',
    color: 'pink',
    ofage: false,
    language: 'eng',
    page: 60,
    order: 'read',
    hasHydrated: false,


    hydrate: (data) => {
        if (get().hasHydrated) return; 
        set({
            username: data.profile.username,
            name: data.profile.name,
            avatar: data.profile.avatar,
            color: data.config.color,
            ofage: data.config.ofage,
            language: data.config.language,
            page: data.config.page,
            order: data.config.order,
            hasHydrated: true
        })
    },

    setLanguage: (lang) => {
        set({language: lang})
    },
 
    setPage: (num) => {
        set({page: num})
    },
    setOrder: (ord) => {
        set({order: ord})
    },
}));