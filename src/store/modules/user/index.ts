import { decodeJwt } from "jose"
import { defineStore } from "pinia"

import { getUserInfo, login, LoginBody, refreshToken, UserInfo } from "@/api/user"
import { storageRemoveItem } from "@/utils/storage"

import { UserState } from "./types"

const useUserStore = defineStore("user", {
  state: (): UserState => ({
    info: undefined,
    token: undefined,
  }),

  actions: {
    resetInfo() {
      this.$reset()
    },

    setInfo(info: UserInfo) {
      this.info = info
    },

    setToken(token: string) {
      const rememberMe = useStorage("remember-me", true)
      const tokenStorage = useStorage("token", "", rememberMe.value ? localStorage : sessionStorage)

      this.token = token
      tokenStorage.value = token

      storageRemoveItem("token", !rememberMe.value ? localStorage : sessionStorage)
    },

    async fetchInfo() {
      const { data } = await getUserInfo(this.getEID() as string)
      this.setInfo(data)
    },

    async login(body: LoginBody) {
      const { data } = await login(body)
      this.setToken(data.token)
    },

    async refreshToken() {
      const { data } = await refreshToken()
      this.setToken(data.token)
    },

    isLogin() {
      return !!this.getToken()
    },

    getToken() {
      if (this.token) return this.token

      const rememberMe = useStorage("remember-me", true)
      const tokenStorage = useStorage("token", "", rememberMe.value ? localStorage : sessionStorage)

      this.token = tokenStorage.value
      return this.token
    },

    getEID() {
      const claims = decodeJwt(this.getToken() as string)
      return claims.sub
    },
  },
})

export default useUserStore
