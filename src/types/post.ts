import { Tag } from "./tag";
import { User } from "./user";

export enum PostStatus {
  All = "all",
  Draft = "draft",
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export const postStatusTrans = {
  [PostStatus.All]: {
    label: "Tất cả",
    value: PostStatus.All,
    color: "",
  },
  [PostStatus.Draft]: {
    label: "Lưu nháp",
    value: PostStatus.Draft,
    color: "orange",
  },
  [PostStatus.Pending]: {
    label: "Chờ duyệt",
    value: PostStatus.Pending,
    color: "blue",
  },
  [PostStatus.Approved]: {
    label: "Đã duyệt",
    value: PostStatus.Approved,
    color: "green",
  },
  [PostStatus.Rejected]: {
    label: "Từ chối",
    value: PostStatus.Rejected,
    color: "red",
  },
};

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  thumbnail: string;
  tags: Tag[];
  viewCount: number;
  totalLike: number;
  liked: boolean;
  totalComment: number;
}
