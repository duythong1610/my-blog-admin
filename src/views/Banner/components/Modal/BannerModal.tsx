import { Form, Input, message, Modal, Radio, Select, Switch } from "antd";
import { Rule } from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { bannerApi } from "api/banner.api";
import { InputNumber } from "components/Input/InputNumber";
import { SingleImageUpload } from "components/Upload/SingleImageUpload";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { PermissionNames } from "router";
import { permissionStore } from "store/permissionStore";
import { ModalStatus } from "types/modal";
import { Banner, BannerType, BannerTypeTrans } from "types/banner";
import { checkRole } from "utils/auth";
import { positiveIntegersRule } from "utils/validate";
import { VisibleStatusTrans } from "types/common";
import { useSearchParams } from "react-router-dom";
import { projectStore } from "store/projectStore";
import { SystemModule } from "types/system-module";
import { getModuleName } from "utils/getModuleName";
import { useSurvey } from "hooks/useSurvey";
import useNews from "hooks/useNews";
const rules: Rule[] = [{ required: true }];

export interface BannerModalProps {
  onClose: () => void;
  onSubmitOk: () => void;
  bannerType?: BannerType;
  // hasAddBannerPermission?: boolean;
  // hasUpdateBannerPermission?: boolean;
}

export interface BannerModal {
  handleUpdate: (banner: Banner) => void;
  handleCreate: () => void;
}

export const BannerModal = forwardRef(
  (
    {
      onSubmitOk,
      bannerType,
    }: // hasAddBannerPermission,
    // hasUpdateBannerPermission,
    BannerModalProps,
    ref
  ) => {
    const [form] = useForm();

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState<boolean>();
    const [selectedBanner, setSelectedBanner] = useState<Banner>();
    const [status, setStatus] = useState<ModalStatus>("create");
    const type = Form.useWatch("type", form);
    const [queryParams] = useSearchParams();
    const projectId = queryParams.get("projectId");

    const {
      fetchSurvey,
      debounceSearchSurvey,
      surveyCampaigns,
      querySurvey,
      totalSurvey,
      loadingSurvey,
    } = useSurvey({
      initQuery: {
        page: 1,
        limit: 50,
        type: getModuleName(),
        projectId: projectStore.project.id,
      },
    });
    const {
      fetchData: fetchNews,
      filterData,
      data: newses,
      loading: loadingNews,
      query,
      deleteData,
      toggleHighlight,
      toggleVisible,
      total,
    } = useNews({
      initialQuery: {
        page: 1,
        limit: 50,
      },
    });
    useEffect(() => {
      if (type == BannerType.Survey) {
        fetchSurvey();
      }
      if (type == BannerType.News) {
        fetchNews();
      }
    }, [type]);

    useImperativeHandle(
      ref,
      () => ({
        handleUpdate,
        handleCreate,
      }),
      []
    );

    const handleUpdate = (banner: Banner) => {
      console.log(banner);
      //fill data vào form khi ấn nút cập nhật
      form.setFieldsValue({
        ...banner,
        surveyCampaignId: banner.surveyCampaign?.id,
        newsId: banner.news?.id,
      });
      setSelectedBanner(banner);
      setStatus("update");
      setVisible(true);
    };

    const handleCreate = () => {
      form.resetFields();
      form.setFieldsValue({
        type:
          bannerType == BannerType.Banner ? BannerType.Banner : BannerType.QC,
      });
      setStatus("create");
      setVisible(true);
    };

    const handleSubmitForm = async () => {
      await form.validateFields();
      const { surveyCampaignId, newsId, ...dataForm } = form.getFieldsValue();
      const payload = {
        banner: {
          ...dataForm,
          module: getModuleName(),
        },
        projectId: projectStore.project.id,
        surveyCampaignId,
        newsId,
      };

      try {
        setLoading(true);
        switch (status) {
          case "update":
            await bannerApi.update(selectedBanner?.id || 0, payload);
            message.success("Cập nhật banner thành công");
            break;

          //create
          default:
            await bannerApi.create(payload);
            message.success("Thêm mới thành công banner!");
            break;
        }
        onSubmitOk();
      } finally {
        setLoading(false);
        setVisible(false);
        onSubmitOk();
      }
    };

    return (
      <Modal
        onCancel={() => {
          setVisible(false);
        }}
        visible={visible}
        centered
        title={
          <h1 className="mb-0 text-lg text-primary font-bold">
            {(status == "create" ? "Thêm" : "Cập nhật") + " banner"}
          </h1>
        }
        confirmLoading={loading}
        destroyOnClose
        width={500}
        onOk={handleSubmitForm}
        afterClose={() => {
          form.resetFields();
        }}
        okText="Xác nhận"
        // okButtonProps={{
        //   hidden:
        //     (!hasAddBannerPermission && status == "create") ||
        //     (!hasUpdateBannerPermission && status == "update"),
        // }}
      >
        <Form
          initialValues={{
            isActive: true,
          }}
          form={form}
          layout="vertical"
        >
          <FormItem
            hidden={bannerType == BannerType.Banner}
            rules={rules}
            required
            label="Loại banner"
            name={"type"}
          >
            <Radio.Group onChange={() => form.setFieldValue("icon", "")}>
              {Object.values(BannerTypeTrans)
                .filter((i) => i.value !== BannerType.Banner)
                .map((item) => (
                  <Radio value={item.value}>{item.label}</Radio>
                ))}
            </Radio.Group>
          </FormItem>

          <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
            {() => {
              return (
                <Form.Item
                  rules={rules}
                  style={{ marginBottom: 0 }}
                  label={<div>Hình ảnh</div>}
                  name="image"
                >
                  <SingleImageUpload
                    recommendSize={{ width: 600, height: 200 }}
                    onUploadOk={(path: string) => {
                      form.setFieldsValue({
                        image: path,
                      });
                    }}
                    imageUrl={form.getFieldValue("image")}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item label="Tiêu đề trang nền" name="title">
            <Input placeholder="Nhập vào tiêu đề trang nền" />
          </Form.Item>
          {type === BannerType.QC && (
            <Form.Item label="Link đến trang khác" name="link">
              <Input placeholder="Nhập vào link đến trang khác" />
            </Form.Item>
          )}

          {type === BannerType.Survey && (
            <Form.Item label="Khảo sát" name="surveyCampaignId">
              <Select
                showSearch
                onSearch={(value) => debounceSearchSurvey(value)}
                allowClear
                options={surveyCampaigns.map((item) => {
                  return {
                    label: (
                      <div>
                        <span className="">{item.name}</span>
                      </div>
                    ),
                    value: item.id,
                  };
                })}
                filterOption={false}
                placeholder="Chọn khảo sát"
              />
            </Form.Item>
          )}

          {type === BannerType.News && (
            <Form.Item label="Tin tức" name="newsId">
              <Select
                showSearch
                onSearch={(value) => debounceSearchSurvey(value)}
                allowClear
                options={newses.map((item) => {
                  return {
                    label: (
                      <div>
                        <span className="">{item.title}</span>
                      </div>
                    ),
                    value: item.id,
                  };
                })}
                filterOption={false}
                placeholder="Chọn tin tức"
              />
            </Form.Item>
          )}

          <Form.Item label="Vị trí" name="pos" rules={[positiveIntegersRule]}>
            <Input placeholder="Nhập vị trí"></Input>
          </Form.Item>
          <Form.Item
            initialValue={true}
            label="Trạng thái hiển thị"
            name="isVisible"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={VisibleStatusTrans.true.label}
              unCheckedChildren={VisibleStatusTrans.false.label}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
