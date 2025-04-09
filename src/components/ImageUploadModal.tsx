import { UploadOutlined } from "@ant-design/icons";
import { insertImage$, usePublisher } from "@mdxeditor/editor";
import { Image, Upload, message } from "antd";
import { useState } from "react";

const ImageUploadModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const insertImage = usePublisher(insertImage$);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Lưu URL của ảnh đã tải lên

  // Xử lý upload ảnh từ DnD
  const handleUpload = async (file: File) => {
    setUploadStatus("Đang tải ảnh lên...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload ảnh thất bại");

      const data = await response.json();
      const uploadedImageUrl = data.secure_url;
      setUploadStatus("Ảnh tải lên thành công!");
      setImageUrl(uploadedImageUrl); // Lưu URL ảnh vào state

      message.success("Ảnh tải lên thành công!");
    } catch (error) {
      setUploadStatus("Tải ảnh thất bại");
      message.error("Tải ảnh thất bại");
      console.error("Error uploading image: ", error);
    }

    return false; // Ngừng tiến trình upload mặc định của Ant Design
  };

  // Xử lý khi người dùng nhấn nút "Tải lên"
  const handleInsertImage = () => {
    if (imageUrl) {
      insertImage({ src: imageUrl }); // Chèn ảnh vào editor
      onClose(); // Đóng modal sau khi ảnh được chèn
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] max-w-lg">
        <h3 className="text-xl mb-4 text-center font-semibold">
          Chọn ảnh để tải lên
        </h3>

        <div className="mb-4 ">
          <Upload.Dragger
            name="file"
            accept="image/*"
            customRequest={({ file }) => handleUpload(file as File)} // Tùy chỉnh request upload
            showUploadList={false} // Ẩn danh sách file tải lên
          >
            <div className="text-center">
              <UploadOutlined className="text-4xl text-gray-500 mb-2" />
              <p className="text-gray-600">
                Kéo thả ảnh vào đây hoặc nhấp để chọn ảnh
              </p>
            </div>
          </Upload.Dragger>
        </div>

        {imageUrl && (
          <div className="mb-4 text-center">
            <p className="text-gray-600">Ảnh đã tải lên:</p>
            <Image
              width={500}
              height={300}
              src={imageUrl}
              alt="Uploaded preview"
              className="max-w-full rounded-md mt-2"
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Hủy
          </button>
          <button
            onClick={handleInsertImage}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Tải lên
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 text-center">{uploadStatus}</p>
      </div>
    </div>
  ) : null;
};

export default ImageUploadModal;
