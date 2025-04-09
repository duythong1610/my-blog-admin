import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Tabs } from "antd";
import { useImperativeHandle, useMemo, useState } from "react";
import { WithCustomRef } from "types/common";

import { ImportExcelCol, ImportExcelDataType } from "utils/importExcel";

export interface PreviewImportModal<T> {
  open: (data: ImportExcelDataType<T>[]) => void;
  close: () => void;
}
interface PreviewImportModalProps {
  onClose: () => void;
  exportColumns: ImportExcelCol<any, any>[];
  previewColumns: ImportExcelCol<any, any>[];
  name: string;
}

export function PreviewImportModal<T>({
  onClose,
  name,
  exportColumns,
  previewColumns,
  myRef,
}: WithCustomRef<PreviewImportModalProps>) {
  const [visible, setVisible] = useState(false);
  const [isImportedData, setIsImportedData] = useState(false);
  const [data, setData] = useState<ImportExcelDataType<T>[]>();

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const handleOpen = () => {
    setVisible(true);
  };

  useImperativeHandle<any, PreviewImportModal<T>>(
    myRef,
    () => ({
      open(newData, isShowFull = false) {
        setIsImportedData(isShowFull);
        setData(newData);
        handleOpen();
      },
      close() {
        handleClose();
      },
    }),
    []
  );

  const successData = useMemo(
    () => (data || []).filter((item) => !item?.errorMessage),
    [data]
  );
  const errorData = useMemo(
    () => (data || []).filter((item) => item?.errorMessage),
    [data]
  );
  const handleDownload = (type: "error" | "success") => {
    let suffixName = type == "error" ? "Thất bại" : "Thành công";
    if (!isImportedData) {
      suffixName = type == "error" ? "Không hợp lệ" : "Hợp lệ";
    }
    import("../../utils/MyExcel").then(({ MyExcel }) =>
      MyExcel.export({
        fileType: "xlsx",
        sheetName: `${name} (${suffixName})`,
        //@ts-ignore
        columns: exportColumns.map((item, index) => ({
          ...item,
          header: item.title,
          render: (data) => {
            const val = data?.[item.key];
            return (
              item?.excelRender?.(data) ??
              item?.render?.(val, data, index) ??
              val
            );
          },
        })),
        data: data || [],
        fileName: `${name} (${suffixName})`,
      })
    );
  };

  return (
    <>
      <Modal
        afterClose={() => {
          setData(undefined);
        }}
        footer={null}
        okButtonProps={{
          className: "hidden",
        }}
        cancelText="Đóng"
        onCancel={handleClose}
        visible={visible}
        title={`Xem ${name}`}
        width={1000}
      >
        <Tabs>
          <Tabs.TabPane
            tabKey="valid"
            key="valid"
            tab={isImportedData ? "Thành công" : "Hợp lệ"}
          >
            {
              <Button
                disabled={!successData.length}
                type="primary"
                onClick={() => handleDownload("success")}
                icon={<DownloadOutlined />}
                className="mb-2"
                size="small"
              >
                Tải xuống {name}
              </Button>
            }
            <Table
              bordered
              scroll={{
                x: "max-content",
                y: 500,
              }}
              onRow={(item) => ({
                className: !!item.errorMessage ? "bg-red-50" : "bg-green-50",
              })}
              pagination={{
                defaultCurrent: 1,
                defaultPageSize: 50,
              }}
              size="small"
              dataSource={successData}
              //@ts-ignore
              columns={previewColumns}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane
            tabKey="invalid"
            key="invalid"
            tab={isImportedData ? "Thất bại" : "Không hợp lệ"}
          >
            <Button
              disabled={!errorData.length}
              type="primary"
              onClick={() => handleDownload("error")}
              icon={<DownloadOutlined />}
              className="mb-2"
              size="small"
            >
              Tải xuống {name}
            </Button>
            <Table
              bordered
              scroll={{
                x: "max-content",
                y: 500,
              }}
              onRow={(item) => ({
                className: !!item.errorMessage ? "bg-red-50" : "bg-green-50",
              })}
              pagination={{
                defaultCurrent: 1,
                defaultPageSize: 50,
              }}
              size="small"
              dataSource={errorData}
              //@ts-ignore
              columns={previewColumns}
            ></Table>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
