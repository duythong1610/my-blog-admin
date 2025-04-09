import { Form, Input } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect } from "react";

interface IPromptModal {
  onClose: () => void;
  visible: boolean;
  onOk: (text: string) => void;
  label: string;
}

export const PromptModal = ({
  onClose,
  visible,
  onOk,
  label,
}: IPromptModal) => {
  const [form] = Form.useForm();

  useEffect(() => {
    visible && form.resetFields();
  }, [visible]);

  const handleSubmit = () => {
    onOk(form.getFieldValue("text"));
    onClose();
  };

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      title={"Reset mật khẩu"}
      style={{ top: 20 }}
      width={500}
      cancelText="Đóng"
      onOk={handleSubmit}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label={label} required name={"text"}>
          <Input placeholder="" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
