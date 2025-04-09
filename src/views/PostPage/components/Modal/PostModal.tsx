import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Popconfirm, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

import { postApi } from "api/post.api";
import { ModalStatus } from "types/modal";
import { Post } from "types/post";
import { MDXEditor } from "@mdxeditor/editor";
import MDXEditorComponent from "components/MDXEditor";
import { debounce } from "lodash";
import MarkdownRenderer from "components/MarkdownRendered";
import ThumbnailPostUpload from "components/Upload/ThumbnailPostUpload";
import { useTag } from "hooks/useTag";

export interface PostModalProps {
  onClose: () => void;
  onSubmitOk: () => void;
  onApprove?: (postId: string) => void;
  onFetchSummary: () => void;
  onReject?: (postId: string, reason: string) => void;
}

export interface PostModalRef {
  handleUpdate: (post: Post) => void;
  handleCreate: () => void;
}

export const PostModal = forwardRef(
  (
    { onSubmitOk, onReject, onApprove, onFetchSummary }: PostModalProps,
    ref
  ) => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [loadingGetDetail, setLoadingGetDetail] = useState(false);
    const [visible, setVisible] = useState<boolean>();
    const [editorKey, setEditorKey] = useState(Date.now());
    const [markdown, setMarkdown] = useState("");
    const thumbnail = Form.useWatch("thumbnail", form);

    const [selectedPost, setSelectedPost] = useState<Post>();

    const [status, setStatus] = useState<ModalStatus>("create");
    const [reason, setReason] = useState<string>("");

    const { tags } = useTag({
      initQuery: {
        page: 1,
        limit: 10,
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        handleUpdate,
        handleCreate,
      }),
      []
    );

    const debouncedSetMarkdown = useCallback(
      debounce((value) => {
        setMarkdown(value);
        console.log("Markdown đã được cập nhật:", value);
      }, 300),
      []
    );

    const handleChange = (newMarkdown: string) => {
      debouncedSetMarkdown(newMarkdown);
    };

    const handleUpdate = (post: Post) => {
      setSelectedPost(post);
      form.setFieldsValue({ ...post });
      setMarkdown(post.content);
      setStatus("update");
      setVisible(true);
    };

    const handleCreate = () => {
      setStatus("create");
      setVisible(true);
    };

    const handleSubmitForm = async () => {
      await form.validateFields();
      const { productSubClassId, ...dataForm } = form.getFieldsValue();
      const payload = {
        product: {
          ...dataForm,
        },
        productSubClassId,
      };

      try {
        setLoading(true);
        switch (status) {
          case "update":
            await postApi.update(selectedPost?._id || "", payload);
            message.success("Cập nhật sản phẩm thành công!");
            break;

          //create
          default:
            await postApi.create(payload);
            message.success("Thêm mới thành công sản phẩm!");
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
              ? "Tạo bài viết"
              : `Chi tiết bài viết - #${selectedPost?.title}`}
          </h1>
        }
        confirmLoading={loading}
        destroyOnClose
        width={1200}
        onOk={handleSubmitForm}
        afterClose={() => {
          form.resetFields();
        }}
        okText="Xác nhận"
        footer={
          <div className="flex items-center justify-end">
            <Popconfirm
              placement="topLeft"
              title={`Xác nhận duyệt hóa đơn này?`}
              onConfirm={() => {
                onApprove?.(selectedPost?._id || "");
                onSubmitOk();
                setVisible(false);
              }}
              okText="Xác nhận"
              cancelText="Không"
            >
              <Button
                icon={<IoShieldCheckmarkOutline />}
                className="!text-white !bg-green-500 !font-medium !flex !items-center gap-2 !border-transparent hover:!border-transparent"
              >
                Duyệt bài viết
              </Button>
            </Popconfirm>

            <Popconfirm
              placement="topLeft"
              title={
                <div>
                  <h1 className="text-sm">Xác nhận từ chối duyệt đơn này?</h1>

                  <TextArea
                    placeholder="Nhập vào lý do từ chối duyệt mua sắm"
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              }
              onConfirm={() => {
                if (!reason) {
                  message.error("Vui lòng nhập lý do từ chối duyệt mua sắm");
                  return;
                }

                onReject?.(selectedPost?._id || "", reason);
                setVisible(false);
              }}
              okText="Xác nhận"
              cancelText="Không"
            >
              <Button
                icon={<CloseOutlined />}
                className=" !text-white !bg-red-500 !font-medium"
              >
                Từ chối
              </Button>
            </Popconfirm>

            <Button
              onClick={() => {
                setVisible(false);
              }}
            >
              Đóng
            </Button>
          </div>
        }
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitForm}
            initialValues={{ title: "" }}
          >
            <Form.Item label="" name={"thumbnail"}>
              <ThumbnailPostUpload
                onUploadOk={(url) => form.setFieldValue("thumbnail", url)}
                imageUrl={thumbnail}
              />
            </Form.Item>
            <Form.Item
              name="title"
              label="Tiêu đề bài viết"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề bài viết" size="large" />
            </Form.Item>
            <Form.Item
              name="tags"
              label="Thẻ bài viết"
              rules={[
                { required: true, message: "Vui lòng chọn thẻ bài viết" },
                {
                  validator: (_, value) => {
                    if (value && value.length > 5) {
                      return Promise.reject("Chỉ được chọn tối đa 5 thẻ");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn thẻ bài viết"
                size="large"
                options={tags?.map((tag) => ({
                  label: tag.name,
                  value: tag._id,
                }))}
              />
            </Form.Item>

            <MDXEditorComponent
              editorKey={editorKey}
              markdown={markdown}
              onChange={handleChange}
            />
          </Form>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Xem trước</h2>
            <MarkdownRenderer content={markdown} />
          </div>
        </div>
      </Modal>
    );
  }
);
