import React, { useRef } from "react";
import { Pagination as AntPagination, PaginationProps } from "antd";
import { formatVND } from "utils";

export interface IPagination {
  total: number;
  onChange: ({ page, limit }: { page: number; limit: number }) => void;
  currentPage: number;
  defaultPageSize?: number;
  showQuickJumper?: boolean;
  showSizeChange?: boolean;
  type?: string;
}

export const Pagination = ({
  total,
  onChange,
  showQuickJumper,
  showSizeChange = false,
  currentPage,
  defaultPageSize = 50,
  type,
}: IPagination) => {
  return (
    <AntPagination
      current={currentPage}
      style={{ marginTop: 12 }}
      total={total}
      showSizeChanger={showSizeChange}
      onChange={(page, limit) => {
        onChange({
          page,
          limit,
        });
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
      }}
      // onShowSizeChange={(limit) => {
      //   onChange({
      //     page: currentPage,
      //     limit,
      //   });
      //   document.body.scrollTop = 0; // For Safari
      //   document.documentElement.scrollTop = 0;
      // }}
      showQuickJumper={showQuickJumper}
      defaultPageSize={defaultPageSize}
      showTotal={(total) =>
        `Tổng ${formatVND(total)} ${type === "image" ? "ảnh" : "dòng"}`
      }
    />
  );
};
