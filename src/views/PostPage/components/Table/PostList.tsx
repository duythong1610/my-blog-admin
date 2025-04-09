import { CloseOutlined, DownOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import Column from "antd/lib/table/Column";
import { IPagination, Pagination } from "components/Pagination";
import DropdownCell from "components/Table/DropdownCell";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { Post, PostStatus, postStatusTrans } from "types/post";

import { formatDateTime } from "utils/date";

interface PropTypes {
  dataSource: Post[];
  loading: boolean;
  loadingDelete?: boolean;
  pagination?: IPagination;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onApprove?: (postId: string) => void;
  onReject?: (postId: string, reason: string) => void;
  showActionColumn?: boolean;
}

export const PostList = ({
  dataSource,
  loading,
  loadingDelete,
  pagination,
  onDelete,
  onApprove,
  onReject,
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
          render={(text, record: Post, index) => {
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
          title="Bài viết"
          dataIndex="title"
          key="title"
          render={(text, record: Post) => {
            return (
              <div className="flex items-center gap-2">
                <Image
                  src={record.thumbnail}
                  className="!h-[60px] !w-[120px] object-contain"
                />
                <span
                  onClick={() => {}}
                  className="font-semibold flex-1 line-clamp-1"
                >
                  {record.title || "--"}
                </span>
              </div>
            );
          }}
        />

        <Column
          width={300}
          title="Tác giả"
          dataIndex="fullName"
          key="author.fullName"
          render={(text, record: Post) => {
            return (
              <div className="flex items-center gap-2">
                <Avatar
                  src={
                    record.author.avatar ||
                    "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                  }
                  className="!h-[30px] !w-[30px] object-contain"
                />
                <span
                  onClick={() => {
                    // onEdit(record);
                  }}
                  className="font-semibold flex-1 line-clamp-1"
                >
                  {record.author.fullName || "--"}
                </span>
              </div>
            );
          }}
        />
        <Column
          align="center"
          width={170}
          title="Gửi lúc"
          dataIndex="createdAt"
          key={"createdAt"}
          render={(text, record: Post) => (
            <span className="">{formatDateTime(record?.createdAt)}</span>
          )}
        />
        <Column
          align="center"
          width={170}
          title="Trạng thái"
          dataIndex="status"
          key={"status"}
          render={(text, record: Post) => (
            <Tag color={postStatusTrans[record.status].color}>
              {postStatusTrans[record.status].label}
            </Tag>
          )}
        />

        {showActionColumn && (
          <Column
            fixed="right"
            width={120}
            align="center"
            title=""
            key="action"
            dataIndex={""}
            render={(text, record: Post) => (
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
                  {
                    label: (
                      <Popconfirm
                        placement="topLeft"
                        title={`Xác nhận duyệt hóa đơn này?`}
                        onConfirm={() => onApprove?.(record._id)}
                        okText="Xác nhận"
                        cancelText="Không"
                      >
                        <Button
                          icon={<IoShieldCheckmarkOutline />}
                          className="w-full !text-white !bg-green-500 !font-medium !flex !items-center gap-2 !border-transparent hover:!border-transparent"
                        >
                          Duyệt bài
                        </Button>
                      </Popconfirm>
                    ),
                    key: "approve",
                    hidden: record.status !== PostStatus.Pending,
                  },
                  {
                    label: (
                      <Popconfirm
                        placement="topLeft"
                        title={
                          <div>
                            <h1 className="text-sm">
                              Xác nhận từ chối duyệt bài này?
                            </h1>
                            <TextArea
                              placeholder="Nhập vào lý do từ chối duyệt bài viết"
                              onChange={(e) => setReason(e.target.value)}
                            />
                          </div>
                        }
                        onConfirm={() => {
                          if (!reason) {
                            message.error(
                              "Vui lòng nhập lý do từ chối duyệt bài viết"
                            );
                            return;
                          }

                          onReject?.(record._id, reason);
                        }}
                        okText="Xác nhận"
                        cancelText="Không"
                      >
                        <Button
                          icon={<CloseOutlined />}
                          className="w-full !text-white !bg-red-500 !font-medium"
                        >
                          Từ chối
                        </Button>
                      </Popconfirm>
                    ),
                    key: "reject",
                    hidden: record.status !== PostStatus.Pending,
                  },
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
                          Xóa bài viết
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
