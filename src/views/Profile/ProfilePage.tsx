import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Row,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { authApi } from "api/auth.api";
import { useEffect, useRef, useState } from "react";
import { userStore } from "store/userStore";
import { getTitle } from "utils";
import { UpdateProfileModal } from "./UpdateProfileModal";
import { observer } from "mobx-react";

export const ProfilePage = observer(({ title }: { title: string }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const updateProfileModalRef = useRef<UpdateProfileModal>();

  useEffect(() => {
    document.title = getTitle(title);
  }, []);

  //handle submit form
  const onFinish = async (values: any) => {
    const oldPassword = form.getFieldValue("oldPassword");
    const newPassword = form.getFieldValue("newPassword");
    setLoading(true);

    try {
      const res = await authApi.passwordUpdate({
        oldPassword,
        newPassword,
      });
      form.resetFields();
      message.success("Cập nhật mật khẩu mới thành công!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Card title="Thông tin" className="!rounded-md !h-[calc(100vh-88px)]">
            <div
              className="card-avatar"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Avatar
                src={userStore.info.avatar}
                icon={userStore.info.fullName?.[0]}
                style={{
                  color: "#f56a00",
                  verticalAlign: "middle",
                  margin: "auto",
                }}
                size={100}
              />
            </div>

            <Divider orientation="left" orientationMargin="0">
              Thông tin khác
            </Divider>
            <p>
              <b>Họ và tên:</b> {userStore.info.fullName}
            </p>
            <p>
              <b>Số điện thoại:</b> {userStore.info.phone || "Chưa cập nhật"}
            </p>
            <p>
              <b>Email: </b> {userStore.info.email || "Chưa cập nhật"}
            </p>

            <Button
              loading={loading}
              type="primary"
              onClick={() =>
                updateProfileModalRef.current?.handleUpdate(userStore.info)
              }
            >
              Cập nhật thông tin
            </Button>
          </Card>
        </Col>
        <Col className="gutter-row" span={12}>
          <Card
            title="Đổi mật khẩu"
            className="!rounded-md !h-[calc(100vh-88px)]"
          >
            <Form
              form={form}
              onFinish={onFinish}
              //   onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="Mật khẩu cũ"
                name="oldPassword"
                required
                rules={[
                  {
                    required: true,
                    message: "Bắt buộc",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                required
                rules={[
                  {
                    required: true,
                    message: "Bắt buộc",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="renewPassword"
                label="Nhập lại mật khẩu mới"
                required
                rules={[
                  {
                    required: true,
                    message: "Bắt buộc",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu mới không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button loading={loading} type="primary" htmlType="submit">
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <UpdateProfileModal
        ref={updateProfileModalRef}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmitOk={() => userStore.getProfile()}
      />
    </>
  );
});
