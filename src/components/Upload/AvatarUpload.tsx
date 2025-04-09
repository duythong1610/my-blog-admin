import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { Image, message, Upload, UploadProps } from "antd";
import React, { useState } from "react";

interface AvatarUploadProps {
  onUploadOk: (url: string) => void;
  imageUrl: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
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
      <Upload {...uploadProps}>
        <div className="relative w-24 h-24 rounded-full border-2 bg-white flex items-center justify-center overflow-hidden shadow-lg duration-200">
          {loading ? (
            <LoadingOutlined className="text-xl text-gray-500" />
          ) : imageUrl ? (
            <Image
              width={100}
              height={100}
              src={imageUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserOutlined className="text-4xl text-gray-400" />
          )}
          <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 w-full text-center">
            Thay ảnh
          </div>
        </div>
      </Upload>
    </div>
  );
};

export default AvatarUpload;
