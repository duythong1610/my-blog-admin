import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { Rule } from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { authApi } from "api/auth.api";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ModalStatus } from "types/modal";
import { User } from "types/user";
const rules: Rule[] = [{ required: true }];

export interface UpdateProfileModalProps {
  onClose: () => void;
  onSubmitOk: () => void;
}

export interface UpdateProfileModal {
  handleUpdate: (staff: Partial<User>) => void;
  handleCreate: () => void;
}

export const UpdateProfileModal = forwardRef(
  ({ onSubmitOk }: UpdateProfileModalProps, ref) => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState<boolean>();
    const [selectedStaff, setSelectedStaff] = useState<Partial<User>>();
    const [status, setStatus] = useState<ModalStatus>("create");
    const [isView, setIsView] = useState(false);
    const onlinePaymentType = Form.useWatch("onlinePaymentType", form);

    useImperativeHandle(
      ref,
      () => ({
        handleUpdate,
      }),
      []
    );

    const handleUpdate = (staff: Partial<User>) => {
      console.log(staff);
      form.setFieldsValue({
        ...staff,
      });
      setSelectedStaff(staff);
      setStatus("update");
      setVisible(true);
    };

    const handleSubmitForm = async () => {
      await form.validateFields();
      const dataForm = form.getFieldsValue();
      console.log(dataForm);
      console.log(onlinePaymentType);
      const payload = {
        staff: dataForm,
      };

      try {
        setLoading(true);
        switch (status) {
          case "update":
            await authApi.updateProfile(payload);
            message.success("Cập nhật thông tin cá nhân thành công");
            break;
        }
        onSubmitOk();
      } finally {
        setLoading(false);
        setVisible(false);
        onSubmitOk();
      }
    };

    // const onChange = (e: RadioChangeEvent) => {
    //   setOnlinePaymentType(e.target.value);
    // };

    return (
      <Modal
        onCancel={() => {
          setVisible(false);
        }}
        visible={visible}
        centered
        title={
          <h1 className="mb-0 text-lg text-primary font-bold">
            {isView ? (
              "Chi tiết đơn vị thanh toán"
            ) : (
              <>
                {" "}
                {(status == "create" ? "Thêm" : "Cập nhật") +
                  " thông tin cá nhân"}
              </>
            )}
          </h1>
        }
        confirmLoading={loading}
        width={700}
        destroyOnClose
        afterClose={() => {
          form.resetFields();
        }}
        maskClosable={false}
        okText="Xác nhận"
        footer={
          <div className={isView ? "none" : ""}>
            <Button onClick={() => setVisible(false)}>Hủy</Button>
            <Button type="primary" onClick={() => handleSubmitForm()}>
              Xác nhận
            </Button>
          </div>
        }
      >
        <Form
          disabled={isView}
          form={form}
          layout="vertical"
          initialValues={{ isEnabled: true }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
                {() => {
                  return (
                    <Form.Item
                      rules={rules}
                      style={{ marginBottom: 0 }}
                      label={<div>Ảnh đại diện</div>}
                      name="avatar"
                    >
                      {/* <SingleImageUpload
                        onUploadOk={(path: string) => {
                          form.setFieldsValue({
                            avatar: path,
                          });
                        }}
                        imageUrl={form.getFieldValue("avatar")}
                      /> */}
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>

            <Col span={24}>
              <FormItem rules={rules} required label="Họ và tên" name={"name"}>
                <Input placeholder="Nhập vào họ và tên" />
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem
                rules={rules}
                required
                label="Số điện thoại"
                name={"phone"}
              >
                <Input placeholder="Nhập vào số điện thoại" />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem rules={rules} required label="Email" name={"email"}>
                <Input placeholder="Nhập vào email" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
);
