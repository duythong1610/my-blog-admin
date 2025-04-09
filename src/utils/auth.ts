import Cookies from "js-cookie";
import md5 from "md5";
import moment from "moment";
import { userStore } from "store/userStore";
export const getToken = () => {
  const token = Cookies.get("token");

  return token || "";
};

export const setToken = (token: string) => {
  return Cookies.set("token", token);
};

export interface roleAction {
  create?: string;
  update?: string;
  detail?: string;
  delete?: string;
  export?: string;
  import?: string;
  showHide?: string;
}

export const checkRoles = <T = {}>(
  roles: roleAction & T
): {
  create?: boolean;
  update?: boolean;
  detail?: boolean;
  delete?: boolean;
  export?: boolean;
  import?: boolean;
  showHide?: boolean;
} & T => {
  const finalRoles = Object.keys(roles)?.reduce<
    {
      create?: boolean;
      update?: boolean;
      detail?: boolean;
      delete?: boolean;
      export?: boolean;
      import?: boolean;
      showHide?: boolean;
    } & T
  >((prev, curr) => {
    //@ts-ignore
    // return {
    //   ...prev,
    //   [curr]: true,
    // }
    //@ts-ignore
    const find = permissions?.find((e) => e.path.includes(roles[curr]));
    if (find)
      return {
        ...prev,
        [curr]: true,
      };
    return {
      ...prev,
      [curr]: false,
    };
    //@ts-ignore
  }, {});

  //@ts-ignore
  return finalRoles;
};

export const generateHash = () => {
  const time = moment().unix();
  const hash = md5(`${import.meta.env.VITE_PUBLIC_HASHKEY}.${time}`);
  return { time, hash };
};
