import { AxiosPromise } from "axios";
import { request } from "utils/request";

export const tagApi = {
  findAll: (params?: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/tags",
      params,
    }),
  create: (data: any): AxiosPromise<any> =>
    request({
      url: "/api/admin/tags",
      data,
      method: "post",
    }),
  update: (id: string, data: any): AxiosPromise<any> =>
    request({
      url: `/api/admin/tags/${id}`,
      method: "patch",
      data,
    }),
  delete: (tagId: string): AxiosPromise<any> =>
    request({
      url: `/api/admin/tags/${tagId}`,
      method: "delete",
    }),
};
