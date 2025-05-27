import { makeAutoObservable } from "mobx";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

class AuthStore {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  userId: number | null = 1; // всегда 1

  constructor() {
    makeAutoObservable(this);

    const access = getCookie("accessToken");
    const refresh = getCookie("refreshToken");

    this.accessToken = typeof access === "string" ? access : null;
    this.refreshToken = typeof refresh === "string" ? refresh : null;

    // Без декодирования, userId просто 1
    if (this.accessToken) {
      this.userId = 1;
    }
  }

  login(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = 1;

    setCookie("accessToken", accessToken);
    setCookie("refreshToken", refreshToken);
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;

    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}

const authStore = new AuthStore();
export default authStore;
