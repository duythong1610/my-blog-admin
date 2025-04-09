import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import logo from "assets/images/logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "router";
import { settings } from "settings";
import { userStore } from "store/userStore";
import { getTitle } from "utils";
import "./styles/LoginPage.scss";
const { Item: FormItem } = Form;

function LoginPage({ title = "" }) {
  const [form] = Form.useForm<{ username: string; password: string }>();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  useEffect(() => {
    document.title = getTitle(title);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const { username, password } = form.getFieldsValue();
    try {
      await userStore.login(username, password);
      await userStore.getProfile();

      navigation("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div style={{ paddingTop: 120 }}>
        <div className="login-container">
          <div className="logo text-center">
            <span style={{ fontSize: 22 }}>
              <img src={logo} width={80} style={{ borderRadius: 5 }} alt="" />
            </span>
          </div>

          <Form onFinish={handleSubmit} form={form} layout={"vertical"}>
            <FormItem
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input prefix={<UserOutlined />} size="large" />
            </FormItem>

            <FormItem
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" />
            </FormItem>

            <FormItem>
              <Button
                htmlType="submit"
                style={{ width: "100%", marginTop: 10 }}
                loading={loading}
                type="primary"
                size="large"
              >
                Đăng nhập
              </Button>
            </FormItem>
          </Form>
          <div>Version: {settings.version}</div>
        </div>
      </div>
    </div>
  );
}

export { LoginPage };
