import { ExportOutlined } from "@ant-design/icons";
import { Button, Modal, Progress } from "antd";
import { useEffect, useMemo, useState } from "react";
import { MyExcelColumn, handleExport } from "utils/MyExcel";
import { AxiosPromise } from "axios";

interface PropsType<T, K> {
  list: T[];
  query: K;
  dataField: string;
  api: (params?: any) => AxiosPromise<any>;
  fileName: string;
  sheetName: string;
  exportColumns: MyExcelColumn<T>[];
}

const ConfirmExportExcel = <T, K>({
  list,
  query,
  api,
  dataField,
  exportColumns,
  fileName,
  sheetName,
}: PropsType<T, K>) => {
  const [percentExportComplete, setPercentExportComplete] = useState<number>(0);

  const [visible, setVisible] = useState<boolean>(false);

  const exportColumnsMemo: MyExcelColumn<T>[] = useMemo(() => {
    return [...exportColumns];
  }, [list]);

  useEffect(() => {
    if (percentExportComplete >= 100) {
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }
  }, [percentExportComplete]);

  return (
    <div>
      <Button
        type="primary"
        loading={false}
        icon={<ExportOutlined />}
        disabled={!list.length}
        onClick={() => {
          setVisible(true);
          handleExport({
            onProgress(percentComplete) {
              setPercentExportComplete(percentComplete);
            },
            exportColumns: exportColumnsMemo,
            fileType: "xlsx",
            dataField,
            query: query,
            api,
            fileName,
            sheetName,
            isGetFullData: true,
            limit: 50,
          });
        }}
      >
        Xuất file excel
      </Button>

      <Modal
        keyboard={false}
        closable={false}
        maskClosable={false}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
        visible={visible}
        title={"Đang xuất excel (vui lòng không tắt trình duyệt)"}
        width={500}
        onOk={() => {}}
      >
        <Progress
          strokeColor="#a855f7"
          percent={+percentExportComplete.toFixed()}
        />
      </Modal>
    </div>
  );
};

export default ConfirmExportExcel;
