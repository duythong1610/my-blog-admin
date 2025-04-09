import React from "react";
import { IoPersonCircleOutline, IoPricetagsOutline } from "react-icons/io5";
import { RouteObject } from "react-router-dom";
import { NotFoundPage } from "views/404/NotFoundPage";
import { LoginPage } from "views/Login/LoginPage";
import { ProfilePage } from "views/Profile/ProfilePage";

import { PiUsersThree } from "react-icons/pi";
import { AdminLayout } from "../layouts/AdminLayout";
import { BiNews } from "react-icons/bi";
import { PostPage } from "views/PostPage/PostPage";
import TagsPage from "views/TagsPage.tsx/TagsPage";
export interface Route extends RouteObject {
  title?: any;
  children?: Route[];
  icon?: React.ReactNode;
  breadcrumb?: string;
  isAccess?: boolean;
  hidden?: boolean;
  name?: string;
  isFeature?: boolean;
  noRole?: boolean;
  aliasPath?: string;
  checkIsDev?: boolean;
  isGameRouter?: boolean;
  isPublic?: boolean; //Ẩn ở menu chọn quyền và luôn hiển thị với tất cả user
}

export enum PermissionNames {
  orderEdit = "order-management/order-edit",
  orderView = "order-management/order-view",
}

export const adminRoutes: Route[] = [
  {
    title: "Quản lý bài viết",
    icon: <BiNews className="!text-lg" />,
    path: "/post",
    name: "/post",
    breadcrumb: "Quản lý bài viết",
    element: <PostPage title="Quản lý bài viết" />,
  },

  {
    title: "Quản lý thẻ bài viết",
    icon: <IoPricetagsOutline className="!text-lg" />,
    path: "/tags",
    name: "/tags",
    breadcrumb: "Quản lý thẻ bài viếtt",
    element: <TagsPage title="Quản lý thẻ bài viết" />,
  },

  {
    title: "Thông tin cá nhân",
    icon: <IoPersonCircleOutline className="!text-lg" />,
    path: "/account-profile",
    name: "/account-profile",
    breadcrumb: "Thông tin cá nhân",
    element: <ProfilePage title="Thông tin cá nhân" />,
    // isPublic: true,
  },
];

const routes: Route[] = [
  {
    path: "/",
    name: "/",
    children: adminRoutes,
    element: <AdminLayout />,
  },
  {
    name: "/login",
    element: <LoginPage title="Đăng nhập" />,
    path: "/login",
  },
  // {
  //   element: <ForgotPasswordPage />,
  //   path: "/forgot-password",
  //   name: "/forgot-password",
  // },

  {
    element: <NotFoundPage />,
    name: "*",
    path: "*",
  },
];

export { routes };
