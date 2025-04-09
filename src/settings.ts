import { userStore } from "store/userStore";
import settingsData from "./settings.json";
import user from "../src/assets/images/user.png";
import noImage from "../src/assets/images/No-Image.png";
export const enum EnvMode {
  development = "development",
  staging = "staging",
  production = "production",
}

export const settings = {
  defaultAvatar: user,
  noImage: noImage,
  checkPermission: false,
  version: settingsData.version,
  dateFormat: "DD/MM/YYYY",
  fullDateFormat: "HH:mm, DD/MM/YYYY",
  isDev: import.meta.env.VITE_IS_DEV == "true",
  isProduction: import.meta.env.VITE_IS_PRODUCTION == "true",
  qrUrl: `https://302broker.bmdapp.store/cai-dat`,
  mode: import.meta.env.VITE_MODE as EnvMode,
};
