export enum Gender {
  Male = "MALE",
  FeMale = "FE_MALE",
}
export const GenderTrans = {
  [Gender.Male]: {
    value: Gender.Male,
    label: "Nam",
  },
  [Gender.FeMale]: {
    value: Gender.FeMale,
    label: "Nữ",
  },
};
export const SUFFIX_ROUTE_NAME = "ACTION";
export const $isDev = import.meta.env.VITE_IS_DEV == "true";
export const $isShowGameRouter =
  import.meta.env.VITE_SHOW_GAME_ROUTER == "true";
export const $googleApiKey = import.meta.env.VITE_GOOLE_API_KEY;
