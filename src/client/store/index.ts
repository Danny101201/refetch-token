import { IUser } from './../lib/types';
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
type Store = {
  authUser: IUser | null
  access_token: string | null
  uploadImage: boolean
  pageLoading: boolean
  setAuthUser: (user: IUser) => void
  setAccessToken: (token: string) => void
  deleteAccessToken: () => void
  setUPloadImage: (isUploading: boolean) => void
  setPageLoading: (isLoading: boolean) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      authUser: null,
      access_token: null,
      uploadImage: false,
      pageLoading: false,
      setAuthUser: (user) => set({ authUser: user }),
      setAccessToken: (token) => set({ access_token: token }),
      deleteAccessToken: () => set({ access_token: null }),
      setUPloadImage: (isUploading) => set({ uploadImage: isUploading }),
      setPageLoading: (isLoading) => set({ pageLoading: isLoading }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )

)
useStore.subscribe(
  (authUser, preauthUser) => console.log(authUser, preauthUser)
)
