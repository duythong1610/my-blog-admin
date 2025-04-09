import React, { useState } from "react";
import { Upload, message, UploadProps, Image } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

interface ThumbnailPostUploadProps {
  onUploadOk: (url: string) => void;
  imageUrl: string;
}

const ThumbnailPostUpload: React.FC<ThumbnailPostUploadProps> = ({
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
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ hỗ trợ tải ảnh!");
      }
      return isImage;
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        setLoading(true);
      }
      if (info.file.status === "done") {
        setLoading(false);
        if (info.file.response?.secure_url) {
          onUploadOk(info.file.response.secure_url);
        } else {
          message.error("Tải ảnh thất bại!");
        }
      } else if (info.file.status === "error") {
        setLoading(false);
        message.error("Tải ảnh thất bại!");
      }
    },
  };

  return (
    <div className="flex flex-col items-center">
      <Upload {...uploadProps}>
        <div className="relative w-64 h-40 rounded-lg border-2 bg-white flex items-center justify-center overflow-hidden shadow-lg duration-200 cursor-pointer">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <LoadingOutlined className="text-2xl text-gray-500" />
            </div>
          ) : imageUrl ? (
            <Image
              width={500}
              height={500}
              src={imageUrl}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <UploadOutlined className="text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Tải ảnh lên</p>
            </div>
          )}
          <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 w-full text-center">
            {loading ? "Đang tải..." : "Chọn ảnh"}
          </div>
        </div>
      </Upload>
    </div>
  );
};

export default ThumbnailPostUpload;
