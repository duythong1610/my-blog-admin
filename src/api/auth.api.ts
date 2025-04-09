import { AxiosPromise } from "axios";
import { request } from "utils/request";

export const authApi = {
  login: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/login",
      data,
      method: "post",
    }),

  passwordUpdate: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/password/update",
      data,
      method: "post",
    }),

  updateProfile: (data: any): AxiosPromise<any> =>
    request({
      url: `/api/admin/profile`,
      data,
      method: "patch",
    }),

  profile: (): AxiosPromise<any> =>
    request({
      url: "/api/admin/profile",
    }),
  checkIGG: (): AxiosPromise<any> =>
    request({
      url: "/api/admin/google/i",
    }),
  GG: (): AxiosPromise<any> =>
    request({
      url: "/api/admin/google",
    }),
  GG2: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/google/2",
      data,
      method: "post",
    }),
  sendOtp: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/forgot",
      data,
      method: "post",
    }),
  resetPassword: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/forgot/confirm",
      data,
      method: "post",
    }),
  verifyOtp: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/otp/verify",
      data,
      method: "post",
    }),
};
