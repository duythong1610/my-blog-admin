import { CloseOutlined, DownOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Image, message, Popconfirm, Space, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Column from "antd/lib/table/Column";
import { IPagination, Pagination } from "components/Pagination";
import DropdownCell from "components/Table/DropdownCell";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { Post, PostStatus, postStatusTrans } from "types/post";
import { Tag } from "types/tag";

import { formatDateTime } from "utils/date";

interface PropTypes {
  dataSource: Tag[];
  loading: boolean;
  loadingDelete?: boolean;
  pagination?: IPagination;
  onEdit?: (tag: Tag) => void;
  onDelete?: (tagId: string) => void;
  showActionColumn?: boolean;
}

export const TagList = ({
  dataSource,
  loading,
  loadingDelete,
  pagination,
  onDelete,
  onEdit,
  showActionColumn = true,
}: PropTypes) => {
  const [reason, setReason] = useState<string>("");

  return (
    <div>
      <Table
        bordered
        scroll={{
          x: "max-content",
          y: "calc(100vh - 315px)",
        }}
        loading={loading}
        pagination={false}
        rowKey="id"
        dataSource={dataSource}
        size="small"
        className="custom-scrollbar"
        // onChange={}
      >
        <Column
          align="center"
          width={80}
          title="STT"
          dataIndex="id"
          key="id"
          render={(text, record: Tag, index) => {
            return (
              <span
                className="font-medium text-primary cursor-pointer hover:underline"
                onClick={() => onEdit?.(record)}
              >
                {index + 1}
              </span>
            );
          }}
        />

        <Column
          title="Tên thẻ bài viết"
          dataIndex="title"
          key="title"
          render={(text, record: Tag) => {
            return (
              <div className="flex items-center gap-2">
                <span
                  onClick={() => {}}
                  className="font-semibold flex-1 line-clamp-1"
                >
                  {record.name || "--"}
                </span>
              </div>
            );
          }}
        />

        {showActionColumn && (
          <Column
            fixed="right"
            width={120}
            align="center"
            title=""
            key="action"
            dataIndex={""}
            render={(text, record: Tag) => (
              //@ts-ignore
              <DropdownCell
                text="Thao tác"
                items={[
                  {
                    onClick: () => "",
                    label: (
                      <Button
                        icon={<EyeOutlined />}
                        type="primary"
                        className="w-full justify-center !flex !items-center gap-2 !font-medium"
                        onClick={() => onEdit?.(record)}
                      >
                        Xem chi tiết
                      </Button>
                    ),
                    key: "update",
                  },
                  ,
                  {
                    label: (
                      <Popconfirm
                        placement="topLeft"
                        title={
                          <div>
                            <h1 className="text-sm">Xác nhận xóa bài viết?</h1>
                          </div>
                        }
                        onConfirm={() => onDelete?.(record._id)}
                        okText="Đồng ý"
                        cancelText="Không"
                      >
                        <Button
                          loading={loadingDelete}
                          icon={<HiOutlineTrash className="text-lg" />}
                          className={`w-full justify-center !flex !items-center gap-2 !text-primary !font-medium`}
                          type="ghost"
                        >
                          Xóa thẻ
                        </Button>
                      </Popconfirm>
                    ),
                    key: "delete",
                  },
                ]}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Thao tác
                    <DownOutlined />
                  </Space>
                </a>
              </DropdownCell>
            )}
          />
        )}
      </Table>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};
