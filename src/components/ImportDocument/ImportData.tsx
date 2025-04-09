import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Spin, Upload } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
import { readerData } from "utils/excel2";

const { Dragger } = Upload;

export interface ImportDataModal {
  open: () => void;
  close: () => void;
}
interface IProps {
  onSuccess?: () => void;
  createApi: (data: any) => any;
  onUploaded?: (excelData: any, setData: (data: any) => any) => void;
  demoExcel?: string;
  uploadText?: string;
  okText?: string;
  titleText?: string;
}

const ImportDocument = forwardRef(
  (
    {
      onSuccess,
      createApi,
      onUploaded,
      demoExcel,
      uploadText = "Kéo thả hoặc click vào đây để upload file",
      okText = "Nhập sản phẩm ngay",
      titleText = "Nhập excel dữ liệu",
    }: IProps,
    ref
  ) => {
    const [errorsLog, setErrorsLog] = useState<any>("");
    const [dataPosts, setDataPosts] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);

    const handleOnImport = async () => {
      if (!dataPosts.length) return;
      const promises: any[] = [];
      dataPosts.forEach((data, index) => {
        promises.push(
          (async () => {
            try {
              const formData = data;
              const res = await createApi(formData);
              if (!res.status) {
                throw index;
              }
            } catch (error: any) {
              const response = error["response"];
              const message =
                response["data"]["message"] || "Lỗi không xác định.";
              return `Dòng ${index + 1}: ${message}`;
            }
          })()
        );
      });
      const data = await Promise.all(promises);
      const errors = data.filter(Boolean);
      if (!errors.length) {
        return onSuccess?.();
      }
      setDataPosts([]);
      setErrorsLog(() => (
        <>
          <pre className="text-success">
            Đã có {dataPosts.length - errors.length} record được tạo thành công!{" "}
            {errors.length} record không thành công.
          </pre>
          <pre className="text-error">{errors.join("\n")}</pre>
        </>
      ));
    };

    const handleOnCancel = () => {
      setVisible(false);
    };
    useImperativeHandle(
      ref,
      () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
      }),
      []
    );

    return (
      <Modal
        maskClosable={false}
        width={1000}
        style={{ top: 50 }}
        visible={visible}
        onCancel={handleOnCancel}
        destroyOnClose={true}
        afterClose={() => {
          setDataPosts([]);
          setErrorsLog("");
        }}
        title={titleText}
        footer={[
          <Button
            type="primary"
            disabled={!dataPosts.length}
            onClick={() => {
              handleOnImport();
            }}
            style={{ color: "#fff" }}
          >
            {okText}
          </Button>,
        ]}
      >
        <Spin spinning={false}>
          {demoExcel && (
            <Link to={demoExcel} target="_blank" download>
              <Space>
                <DownloadOutlined />
                Tải file import mẫu
              </Space>
            </Link>
          )}

          <Dragger
            style={{ marginTop: "0.5em" }}
            maxCount={1}
            multiple={false}
            beforeUpload={async (file) => {
              //Check file type
              const isCSVFile = file.name.includes("xlsx");
              if (isCSVFile === false) {
                message.error("Bạn chỉ có thể upload file excel!");
                return Upload.LIST_IGNORE;
              }
              const excelData = await readerData(file);
              onUploaded?.(excelData, setDataPosts);

              return false;
            }}
            onChange={(info) => {
              //reset data
              if (info.fileList.length == 0) {
                setErrorsLog(null);
                setDataPosts([]);
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{uploadText}</p>
          </Dragger>

          {errorsLog && (
            <div
              className="logs"
              style={{
                marginTop: "10px",
                width: "100%",
                maxHeight: "400px",
                border: "thin solid rgba(0,0,0,0.2)",
                minHeight: "200px",
                overflowY: "auto",
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: "15px",
                fontSize: "18px",
              }}
            >
              {errorsLog}
            </div>
          )}
        </Spin>
        <Space
          style={{ width: "100%", justifyContent: "end", marginTop: "1em" }}
        ></Space>
      </Modal>
    );
  }
);

export default ImportDocument;
