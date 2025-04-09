import {
  DeleteOutlined,
  DownOutlined,
  EditFilled,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Image, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import Column from "antd/lib/table/Column";
import { IPagination, Pagination } from "components/Pagination";
import DropdownCell from "components/Table/DropdownCell";
import React from "react";
import { Banner, BannerType, BannerTypeTrans } from "types/banner";
import { formatVND } from "utils";
import { unixToFullDate } from "utils/dateFormat";
import { BannerModal } from "../Modal/BannerModal";
import { PermissionNames } from "router";
import { permissionStore } from "store/permissionStore";
import { checkRole } from "utils/auth";
import { GrEdit } from "react-icons/gr";
import { HiOutlineTrash } from "react-icons/hi2";

interface PropsType {
  dataSource: Banner[];
  loading: boolean;
  pagination?: IPagination;
  bannerModalRef?: React.MutableRefObject<BannerModal | undefined>;
  onDelete?: (stockCodeId: number) => void;
  onRefreshData?: () => void;
  showActionColumn?: boolean;
  showStatusColumn?: boolean;
  showCustomerRankColumn?: boolean;
  // hasDeleteBannerPermission?: boolean;
  // hasUpdateBannerPermission?: boolean;
}

export const BannerList = ({
  dataSource,
  loading,
  pagination,
  bannerModalRef,
  onRefreshData,
  onDelete,
  showActionColumn = true,
  showStatusColumn = true,
  showCustomerRankColumn = true,
}: // hasDeleteBannerPermission,
// hasUpdateBannerPermission,
PropsType) => {
  return (
    <div>
      <Table
        bordered
        scroll={{
          x: "max-content",
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
          title="Vị trí"
          dataIndex="pos"
          key="pos"
          render={(text, record: Banner) => {
            return (
              <span className="font-medium text-primary">
                {record.pos || "--"}
              </span>
            );
          }}
        />
        <Column
          title="Hình ảnh"
          dataIndex="name"
          key={"name"}
          render={(text, record: Banner) => (
            <div className="flex items-center gap-3">
              <Image
                src={record.image}
                className="!h-[35px] object-contain !w-[50px]"
              />
              <span
                className="font-medium text-primary cursor-pointer"
                onClick={() => bannerModalRef?.current?.handleUpdate(record)}
              >
                {record?.title}
              </span>
            </div>
          )}
        />

        <Column
          width={150}
          title="Loại"
          dataIndex="type"
          key={"type"}
          render={(text, record: Banner) => (
            <Tooltip
              title={
                record.type == BannerType.Survey && record?.surveyCampaign
                  ? record?.surveyCampaign?.name
                  : null
              }
            >
              <Tag color={record.type == BannerType.Banner ? "blue" : "green"}>
                {BannerTypeTrans[record.type]?.label}
              </Tag>
            </Tooltip>
          )}
        />

        {showStatusColumn && (
          <>
            <Column
              align="center"
              width={150}
              title="Thời gian tạo"
              dataIndex="createdAt"
              key={"createdAt"}
              render={(text, record: Banner) => (
                <span className="">{unixToFullDate(record?.createdAt)}</span>
              )}
            />
          </>
        )}

        {showActionColumn && (
          <Column
            fixed="right"
            width={120}
            align="center"
            title=""
            key="moneyCommission"
            dataIndex={"moneyCommission"}
            render={(text, record: Banner) => (
              //@ts-ignore
              <DropdownCell
                text="Thao tác"
                items={[
                  {
                    onClick: () => "",
                    label: (
                      <Button
                        icon={<GrEdit />}
                        type="primary"
                        className="w-full justify-center !flex !items-center gap-2 !font-medium"
                        onClick={() => {
                          bannerModalRef?.current?.handleUpdate(record);
                        }}
                      >
                        {"Cập nhật"}
                      </Button>
                    ),
                    key: "update",
                    // hidden: !hasUpdateBannerPermission,
                  },
                  {
                    label: (
                      <Popconfirm
                        placement="topLeft"
                        title={
                          <div>
                            <h1 className="text-sm">
                              Xác nhận xóa banner này?
                            </h1>
                          </div>
                        }
                        onConfirm={() => onDelete?.(record.id)}
                        okText="Đồng ý"
                        cancelText="Không"
                      >
                        <Button
                          icon={<HiOutlineTrash className="text-lg" />}
                          className={`w-full justify-center !flex !items-center gap-2 !text-primary !font-medium`}
                          type="ghost"
                        >
                          Xóa banner
                        </Button>
                      </Popconfirm>
                    ),
                    key: "delete",
                    // hidden: !hasDeleteBannerPermission,
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
