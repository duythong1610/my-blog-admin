import { message } from "antd";

export const downloadFile = async (
  fileUrl: string,
  fileName?: string,
  setLoading?: (loading: boolean) => void
) => {
  if (setLoading) setLoading(true);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "downloaded-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error fetching the file:", error);
    message.error("Có lỗi khi tải file, vui lòng thử lại sau!");
  } finally {
    if (setLoading) setLoading(false);
  }
};
