import { makeAutoObservable } from "mobx"
import { setCookie, deleteCookie, getCookie } from "cookies-next"

class AuthStore {
  accessToken: string | null = null
  refreshToken: string | null = null

  constructor() {
    makeAutoObservable(this)

  // Добавь это:
  const access = getCookie("accessToken")
  const refresh = getCookie("refreshToken")

  this.accessToken = typeof access === "string" ? access : null
  this.refreshToken = typeof refresh === "string" ? refresh : null
  }

  login(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken

    setCookie("accessToken", accessToken)
    setCookie("refreshToken", refreshToken)
  }

  logout() {
    this.accessToken = null
    this.refreshToken = null
    deleteCookie("accessToken")
    deleteCookie("refreshToken")
  }

  isAuthenticated() {
    return !!this.accessToken
  }
}

const authStore = new AuthStore()
export default authStore
