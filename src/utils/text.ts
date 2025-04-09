import { message } from "antd";

export async function copyContent(content: any) {
  try {
    await navigator.clipboard.writeText(content);
    message.success("Sao chép thành công");
    /* Resolved - text copied to clipboard successfully */
  } catch (err) {
    console.error("Sao chép không thành công");
    /* Rejected - text failed to copy to the clipboard */
  }
}
