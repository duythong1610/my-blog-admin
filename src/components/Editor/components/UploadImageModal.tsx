import { Modal } from "antd";
import { SingleImageUpload } from "components/Upload/SingleImageUpload";
import { useCallback, useEffect, useState } from "react";

export const UploadImageModal = ({
  visible,
  onClose,
  onSubmitOk,
  uploadUrl,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmitOk: (imagePath: string) => void;
  uploadUrl?: string;
}) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (visible) {
      setImage("");
    }
  }, [visible]);

  const handleUploadImageOk = useCallback((path: string) => {
    setImage((prev) => path);
  }, []);

  return (
    <Modal
      maskClosable={false}
      onCancel={onClose}
      visible={visible}
      title={"Upload ảnh"}
      style={{ top: 20 }}
      width={700}
      onOk={() => {
        onSubmitOk(image);
      }}
    >
      <div className="text-center">
        <SingleImageUpload
          uploadUrl={uploadUrl}
          onUploadOk={handleUploadImageOk}
          imageUrl={image}
        />
      </div>

      {/* <Input.TextArea
        onChange={(e) => setDesc(e.target.value)}
        style={{ marginTop: "5px" }}
        placeholder="Mô tả ảnh"
      /> */}
    </Modal>
  );
};
