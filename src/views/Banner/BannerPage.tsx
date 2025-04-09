import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Space, message } from "antd";
import { bannerApi } from "api/banner.api";
import useBanner from "hooks/useBanner";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PermissionNames } from "router";
import { permissionStore } from "store/permissionStore";
import { getTitle } from "utils";
import { checkRole } from "utils/auth";
import { BannerModal } from "./components/Modal/BannerModal";
import { BannerList } from "./components/Table/BannerList";
import { BannerType, BannerTypeTrans } from "types/banner";
import { projectStore } from "store/projectStore";

export const BannerPage = observer(
  ({ title = "", type }: { title?: string; type?: BannerType }) => {
    const bannerModalRef = useRef<BannerModal>();
    const [tabActive, setTabActive] = useState<string>("1");
    const [queryParams] = useSearchParams();
    const projectId = queryParams.get("projectId");

    const {
      fetchBanner,
      isFetchBannerLoading,
      banners,
      queryBanner,
      totalBanner,
    } = useBanner({
      initialQuery: {
        limit: 50,
        search: "",
        page: 1,
        projectId: projectStore.project?.id,
      },
      type,
    });

    // const hasBannerAddPermission = checkRole(
    //   PermissionNames.consumerBannerAdd,
    //   permissionStore.permissions
    // );
    // const hasBannerUpdatePermission = checkRole(
    //   PermissionNames.consumerBannerEdit,
    //   permissionStore.permissions
    // );
    // const hasBannerDeletePermission = checkRole(
    //   PermissionNames.consumerBannerDelete,
    //   permissionStore.permissions
    // );
    useEffect(() => {
      document.title = getTitle(title);
      fetchBanner();
    }, [type]);

    // Hàm xóa gói thành viên
    const handleDeleteBanner = async (bannerId: number) => {
      try {
        const res = await bannerApi.delete(bannerId);
        fetchBanner();
        message.success("Xóa banner thành công!");
      } catch (error) {}
    };

    return (
      <Card bodyStyle={{ padding: "8px 20px" }} style={{ borderRadius: "8px" }}>
        <div className="filter-container">
          <Space>
            {/* <div className="filter-item">
              <label htmlFor="">Loại banner</label> <br />
              <Select
                style={{ width: 200 }}
                allowClear
                onChange={(value) => {
                  queryBanner.type = value;
                  fetchBanner();
                }}
                size="middle"
                placeholder="Chọn loại banner"
                options={Object.values(BannerTypeTrans).map((item) => {
                  return {
                    label: item.label,
                    value: item.value,
                  };
                })}
              />
            </div> */}
            <div className="filter-item">
              <label htmlFor="">Tìm kiếm</label>
              <Input
                allowClear
                onChange={(ev) => {
                  const value = ev.target.value;
                  if (value) {
                    queryBanner.search = value;
                  } else {
                    queryBanner.search = undefined;
                    fetchBanner();
                  }
                }}
                onKeyDown={(ev) => {
                  if (ev.code == "Enter") {
                    fetchBanner();
                  }
                }}
                size="middle"
                placeholder="Tìm kiếm theo tiêu đề"
              />
            </div>
            <div className="filter-item btn">
              <Button
                onClick={() => {
                  fetchBanner();
                }}
                type="primary"
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </div>
            {/* {hasBannerAddPermission && ( */}
            <div className="filter-item btn">
              <Button
                onClick={() => {
                  bannerModalRef.current?.handleCreate();
                }}
                type="primary"
                icon={<PlusOutlined />}
              >
                Thêm mới
              </Button>
            </div>
            {/* )} */}
          </Space>
        </div>
        <BannerList
          dataSource={banners}
          loading={isFetchBannerLoading}
          pagination={{
            total: totalBanner,
            defaultPageSize: queryBanner.limit,
            currentPage: queryBanner.page,
            onChange: ({ page, limit }) => {
              Object.assign(queryBanner, {
                page,
                limit,
              });
              fetchBanner();
            },
          }}
          bannerModalRef={bannerModalRef}
          onRefreshData={fetchBanner}
          onDelete={handleDeleteBanner}
          showCustomerRankColumn={false}
          // hasDeleteBannerPermission={hasBannerDeletePermission}
          // hasUpdateBannerPermission={hasBannerUpdatePermission}
        />

        <BannerModal
          bannerType={type}
          ref={bannerModalRef}
          onClose={() => {
            ("");
          }}
          onSubmitOk={fetchBanner}
          // hasAddBannerPermission={hasBannerAddPermission}
          // hasUpdateBannerPermission={hasBannerUpdatePermission}
        />
      </Card>
    );
  }
);
