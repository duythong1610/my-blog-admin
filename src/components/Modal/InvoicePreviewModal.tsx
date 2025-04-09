import { Image, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FileAttach } from "types/fileAttach";
import { ModalStatus } from "types/modal";

export interface InvoicePreviewModalProps {
  onClose: () => void;
  onSubmitOk: () => void;
}

export interface InvoicePreviewModalRef {
  handleView: (fileAttaches: FileAttach[]) => void;
  handleCreate: () => void;
}

export const InvoicePreviewModal = forwardRef(
  ({ onSubmitOk }: InvoicePreviewModalProps, ref) => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState<boolean>();

    const [selectedFileAttaches, setSelectedFileAttaches] =
      useState<FileAttach[]>();
    const [status, setStatus] = useState<ModalStatus>("create");

    useImperativeHandle(
      ref,
      () => ({
        handleView,
        handleCreate,
      }),
      []
    );

    const handleView = (fileAttaches: FileAttach[]) => {
      setSelectedFileAttaches(fileAttaches);
      setStatus("update");
      setVisible(true);
    };

    const handleCreate = () => {
      setStatus("create");
      setVisible(true);
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
            Chi tiết ảnh hóa đơn
          </h1>
        }
        confirmLoading={loading}
        destroyOnClose
        width={700}
        afterClose={() => {
          form.resetFields();
        }}
        okButtonProps={{
          hidden: true,
        }}
        cancelText="Đóng"
      >
        <div className="flex items-center gap-5 flex-wrap">
          {selectedFileAttaches?.map((item) => (
            <Image
              className="!w-[100px] !h-[160px] object-cover rounded-md"
              src={item.url}
            />
          ))}
        </div>
      </Modal>
    );
  }
);
