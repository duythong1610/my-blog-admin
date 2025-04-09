// import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { Alert, Button, message, Modal, Space, Table, Upload } from "antd";
import { ColumnsType } from "antd/lib/table";
import Dragger from "antd/lib/upload/Dragger";
import { RenderedCell } from "rc-table/lib/interface";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "types/product";
import { MyExcel } from "utils/MyExcel";


export type ColumnImportDocumentType = Omit<ColumnsType<any>, 'render'> & {
  render?: (data: any) => React.ReactNode | RenderedCell<unknown>
}

export interface IRules {
  required?: {
    data?: any
    message?: string;
  },
  unique?: {
    data?: any
    message?: string;
  }
  includes?: {
    data?: any[]
    message?: string;
  }
}

interface IProps {
  columnsKey: any,
  columns: Omit<ColumnsType<any>, 'render'> & {
    render?: (data: any) => React.ReactNode | RenderedCell<unknown>
  },
  validateRules: {
    [key: string]: IRules
  },
  getFormData: (data: any) => any,
  createApi: (data: any) => any,
  onCancel: () => void;
  visible: boolean;
  onSuccess: () => void;
}

const ImportDocument = ({ validateRules, columns, columnsKey, getFormData, createApi, visible, onCancel, onSuccess }: IProps) => {
  const [errorsData, setErrorsData] = useState<any[]>([])
  const [finalData, setFinalData] = useState<Product[]>([]);
  const [errorsLog, setErrorsLog] = useState<any>("");

  const finalColumns = [{
    key: "line",
    dataIndex: 'line',
    title: "Dòng"
  }, ...columns.map((column: any) => ({
    ...column,
    render: (text: any, record: any) => (text && <span className="text-error">{text}</span>) || (column?.render ? (column?.render(record['originData'][column.dataIndex])) : record['originData'][column.dataIndex])
  }))]
  console.log('[IMPORT EXCEL] - OPEN.');


  const handleOnImport = async () => {
    if (!!errorsData.length || !finalData.length) return;
    const promises: any[] = []
    finalData.forEach((data, index) => {
      promises.push((async () => {
        try {
          const formData = getFormData(data);
          const res = await createApi(formData);
          if (!res.status) {
            throw index;
          }

        } catch (error: any) {
          const response = error['response'];
          const message = response['data']['message'] || 'Lỗi không xác định.';
          return `Dòng ${index + 1}: ${message}`;
        }
      })())
    })
    const data = await Promise.all(promises);
    const errors = data.filter(Boolean);
    if (!errors.length) {
      return onSuccess();
    }
    setFinalData([]);
    setErrorsLog(() => <><pre className="text-success">
      Đã có {finalData.length - errors.length} record được tạo thành công! {errors.length} record không thành công.
    </pre>
      <pre className="text-error">
        {errors.join("\n")}
      </pre></>);

  }

  const handleDocumentData = (data: any[]) => {
    let errors: any[] = [];
    let unique: {
      [key: string]: string[]
    } = {};
    const finalData = data.reduce((prev, row, index) => {
      let newRow: any = {};
      let error: {
        [key: string]: any
      } = {};
      for (const key in row) {
        let value = row[key];
        const orginKey = columnsKey[key];
        if (validateRules[orginKey]) {
          Object.keys(validateRules[orginKey]).forEach((ruleKey) => {
            if (ruleKey === 'required') {
              const rule = validateRules[orginKey][ruleKey];
              if (!value) {
                error[orginKey] = rule?.message;
              }
            } else if (ruleKey === 'unique') {
              const rule = validateRules[orginKey][ruleKey];

              if (!(orginKey in unique)) {
                unique[orginKey] = [];
              }

              const isExist = unique[orginKey].includes(value);

              if (isExist) {
                error[orginKey] = rule?.message;
              } else {
                unique[orginKey].push(value);
              }

            } else if (ruleKey === 'includes') {
              const rule = validateRules[orginKey][ruleKey];
              const isExist = rule?.data?.includes(value);
              if (!isExist) {
                error[orginKey] = rule?.message;
              }
            }
          })
        }
        newRow[columnsKey[key]] = value;
      }
      if (Object.keys(error).length) {
        error['line'] = index + 1;
        error['originData'] = newRow;
        errors.push(error);
        return prev;
      }
      return [...prev, newRow];
    }, []);
    console.log('[IMPORT-DOC] final data: ', finalData);
    console.log('[IMPORT-DOC] errors: ', errors);
    setErrorsData(errors);
    setFinalData(finalData);
  }


  return <Modal
    style={{ top: 50 }}
    visible={visible}
    onCancel={onCancel}
    destroyOnClose={true}
    afterClose={() => {
      setErrorsData([]);
      setFinalData([]);
      setErrorsLog("");
    }}
    title="Import data"
    width={"90vw"}
    footer={[
      <Button
        type="primary"
        disabled={!!errorsData.length || !finalData.length}
        onClick={() => {
          handleOnImport();
        }}
        style={{ color: "#fff" }}
      >
        Nhập sản phẩm ngay
      </Button>,
    ]}
  >
    <Alert
      style={{ padding: "10px", marginBottom: "10px" }}
      message={<b>Lưu ý</b>}
      type="warning"
      description={
        <>
          Hạn chế thay đổi tiêu đề trong file csv mẫu để tránh import thiếu
          dữ liệu
        </>
      }
    />
    <Link to="/Danh sách sản phẩm - Demo.csv" target="_blank" download>
      <Space>
        <DownloadOutlined />
        Tải file import mẫu
      </Space>
    </Link>

    <Dragger
      style={{ marginTop: "0.5em" }}
      maxCount={1}
      multiple={false}
      beforeUpload={(file) => {
        //Check file type
        const isCSVFile = file.name.includes("csv");
        if (isCSVFile === false) {
          message.error("You can only upload CSV file!");
          return Upload.LIST_IGNORE;
        }

        MyExcel.import(file).then((data) => {
          handleDocumentData(data as any[]);
        });
        return false;
      }}
      onChange={(info) => {
        //reset data
        if (info.fileList.length == 0) {
          setErrorsLog(null);
          setErrorsData([]);
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Kéo thả hoặc click vào đây để upload file
      </p>
    </Dragger>

    {errorsData.length !== 0 && <>
      <Table
        pagination={{
          pageSize: 10,
        }}
        style={{
          marginTop: '10px'
        }}
        columns={finalColumns}
        bordered
        rowKey="id"
        dataSource={errorsData}
      >
      </Table></>}
    {errorsLog && <div className="logs" style={{
      marginTop: '10px',
      width: '100%',
      maxHeight: '400px',
      border: 'thin solid rgba(0,0,0,0.2)',
      minHeight: "200px",
      overflowY: 'auto',
      backgroundColor: 'rgba(0,0,0,0.1)',
      padding: '15px',
      fontSize: '18px',
    }}>
      {errorsLog}
    </div>}
    <Space
      style={{ width: "100%", justifyContent: "end", marginTop: "1em" }}
    ></Space>
  </Modal>
}


export default ImportDocument