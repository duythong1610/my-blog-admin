import { Form, Input, message, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { forwardRef, useImperativeHandle, useState } from "react";

import { postApi } from "api/post.api";
import { ModalStatus } from "types/modal";
import { Tag } from "types/tag";
import { tagApi } from "api/tag.api";

export interface TagModalProps {
  onClose: () => void;
  onSubmitOk: () => void;
}

export interface TagModalRef {
  handleUpdate: (tag: Tag) => void;
  handleCreate: () => void;
}

export const TagModal = forwardRef(({ onSubmitOk }: TagModalProps, ref) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState<boolean>();

  const [selectedTag, setSelectedTag] = useState<Tag>();

  const [status, setStatus] = useState<ModalStatus>("create");

  useImperativeHandle(
    ref,
    () => ({
      handleUpdate,
      handleCreate,
    }),
    []
  );

  const handleUpdate = (tag: Tag) => {
    setSelectedTag(tag);
    form.setFieldsValue({ ...tag });
    setStatus("update");
    setVisible(true);
  };

  const handleCreate = () => {
    setStatus("create");
    setVisible(true);
  };

  const handleSubmitForm = async () => {
    await form.validateFields();
    const dataForm = form.getFieldsValue();
    const payload = {
      ...dataForm,
    };

    try {
      setLoading(true);
      switch (status) {
        case "update":
          await tagApi.update(selectedTag?._id || "", payload);
          message.success("Cập nhật thẻ bài viết thành công!");
          break;

        //create
        default:
          await tagApi.create(payload);
          message.success("Thêm thẻ bài viết thành công!");
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
      maskClosable={false}
      visible={visible}
      centered
      title={
        <h1 className="mb-0 text-lg text-primary font-bold">
          {status == "create"
            ? "Tạo thẻ bài viết"
            : `Chi tiết thẻ bài viết - #${selectedTag?.name}`}
        </h1>
      }
      confirmLoading={loading}
      destroyOnClose
      width={400}
      onOk={handleSubmitForm}
      afterClose={() => {
        form.resetFields();
      }}
      okText="Xác nhận"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitForm}
          initialValues={{ title: "" }}
        >
          <Form.Item
            name="name"
            label="Tên thẻ bài viết"
            rules={[
              { required: true, message: "Vui lòng nhập tên thẻ bài viết" },
            ]}
          >
            <Input placeholder="Nhập tên thẻ bài viết" size="large" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
});
