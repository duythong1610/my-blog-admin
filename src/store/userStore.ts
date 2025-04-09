import OneSignalReact from "react-onesignal";

import { authApi } from "api/auth.api";
import { setToken } from "utils/auth";
import { action, makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { $isDev } from "constant";
import { User } from "types/user";

class UserStore {
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "UserStore",
      properties: ["info", "token"],
      storage: window.localStorage,
    });
  }

  info: Partial<User> = {};
  token = "";

  @action
  async login(username: string, password: string) {
    const res = await authApi.login({ username, password });
    setToken(res.data.token);
    this.token = res.data.token;
  }

  @action
  async getProfile() {
    const res = await authApi.profile();
    this.info = res.data;
  }

  @action
  logout = () => {
    if (!$isDev) {
      const token = this.token;
      //   oneSignal.userLogout(token);
    }
    setToken("");
    this.token = "";
  };
}

const userStore = new UserStore();

export { userStore };
