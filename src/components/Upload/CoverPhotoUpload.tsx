import { LoadingOutlined } from "@ant-design/icons";
import { Button, Image, message, Upload, UploadProps } from "antd";
import React, { useState } from "react";

interface CoverPhotoUploadProps {
  onUploadOk: (url: string) => void;
  imageUrl: string;
}

const CoverPhotoUpload: React.FC<CoverPhotoUploadProps> = ({
  onUploadOk,
  imageUrl,
}) => {
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    name: "file",
    action: `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUD_NAME
    }/image/upload`,
    data: (file) => ({
      upload_preset: import.meta.env.VITE_UPLOAD_PRESET,
      file,
    }),
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        setLoading(false);
        const url = info.file.response.secure_url;
        onUploadOk(url);
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error("Tải ảnh lên thất bại!");
      }
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-[200px] overflow-hidden">
        {loading ? (
          <LoadingOutlined className="text-xl text-gray-500" />
        ) : imageUrl ? (
          <Image
            width={500}
            height={200}
            src={imageUrl}
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <></>
        )}
        <Upload {...uploadProps} className="cover-upload">
          <div className="absolute bottom-2 right-2">
            <Button size="small">Cập nhật ảnh bìa</Button>
          </div>
        </Upload>
      </div>
    </div>
  );
};

export default CoverPhotoUpload;
