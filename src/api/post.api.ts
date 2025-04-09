import { AxiosPromise } from "axios";
import { request } from "utils/request";

export const postApi = {
  findAll: (params?: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/post",
      params,
    }),
  summaryStatus: (): AxiosPromise<any> =>
    request({
      url: "/api/admin/summary/status",
    }),
  findOne: (id: string): AxiosPromise<any> =>
    request({
      url: `/api/admin/post/${id}`,
    }),
  create: (data: any): AxiosPromise<any> =>
    request({
      url: "/v1/admin/post",
      data,
      method: "post",
    }),
  update: (id: string, data: any): AxiosPromise<any> =>
    request({
      url: `/v1/admin/post/${id}`,
      method: "patch",
      data,
    }),
  approve: (postId: string): AxiosPromise<any> =>
    request({
      url: `/api/admin/post/${postId}/approve`,
      method: "put",
    }),
  reject: (postId: string, data: any): AxiosPromise<any> =>
    request({
      url: `/api/admin/post/${postId}/reject`,
      method: "put",
      data,
    }),
  delete: (postId: string): AxiosPromise<any> =>
    request({
      url: `/api/admin/post/${postId}/reject`,
      method: "put",
    }),
};
