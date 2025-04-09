import { message } from "antd";
import { AxiosPromise } from "axios";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export interface MyExcelColumn<T> extends Partial<ExcelJS.Column> {
  headingStyle?: CellStyle;
  mergeHeader?: {
    column?: number;
    row?: number;
  };
  parentKey?: string;
  childrenIndex?: number;
  originKey?: string;
  children?: MyExcelColumn<T>[];
  columnKey?: string;
  isHyperLink?: boolean;
  render?: (value: any | T, index: number) => any;
  headingAlignment?: Partial<ExcelJS.Alignment>;
  multipleLine?: boolean;
}

export interface CellStyle extends Partial<ExcelJS.Style> {}

export const ExcelTheme: {
  borderStyles: Partial<ExcelJS.Borders>;
  font: {
    [type: string]: Partial<ExcelJS.Font>;
  };
  bg: {
    [type: string]: Partial<ExcelJS.Fill>;
  };
} = {
  borderStyles: {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  },

  font: {
    fontRed: {
      color: { argb: "ff0000" },
      bold: true,
    },
  },

  bg: {
    bgYellow: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ffff00" },
    },

    bgRed: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff7373" },
    },
  },
};

const getFinalValue = <T>(data: T, cellObject: any, index: number) => {
  const values = Object.keys(cellObject).reduce((final, key) => {
    const currentColumn = cellObject[key];
    return {
      ...final,
      //@ts-ignore
      [key as string]: currentColumn?.render
        ? !currentColumn.parentKey
          ? currentColumn?.isHyperLink
            ? {
                text: currentColumn?.render(data, index),
                hyperlink: currentColumn?.render(data, index),
                styles: {
                  font: {
                    color: {
                      argb: "#ff0713f2",
                    },
                  },
                },
              }
            : currentColumn?.render(data, index)
          : currentColumn?.render(
              //@ts-ignore
              data?.[currentColumn.parentKey]?.[currentColumn.childrenIndex],
              index
            )
        : //@ts-ignore
          data?.[currentColumn.parentKey]?.[currentColumn.childrenIndex]?.[
            currentColumn.originKey
          ],
    };
  }, {});
  return values;
};

const autoFit = (
  worksheet: ExcelJS.Worksheet,
  ignoreHeaders: string[] = []
) => {
  worksheet.columns.forEach(function (column: any, i) {
    if (!ignoreHeaders.includes(column.header as string)) {
      let maxLength = 100;
      let minLength = 20;
      let length = 0;
      //@ts-ignore
      column["eachCell"]({ includeEmpty: true }, function (cell: ExcelJS.Cell) {
        var columnLength = cell.value
          ? cell.value.toString().length
          : minLength;
        if (columnLength >= minLength && columnLength <= maxLength) {
          length = columnLength;
        } else if (columnLength < minLength) length = minLength;
        else length = maxLength;
      });

      column.width = length + 5;
    }
  });
};

interface MyExcelProps<T> {
  fileName?: string;
  sheetName?: string;
  columns: MyExcelColumn<T>[];
  data: T[];
  cells?: {
    position: string;
    value: any;
    style?: ExcelJS.Style;
  }[];
  fileType: "xlsx" | "csv";
  onProgress: (percentComplete: number) => void;
  onComplete?: () => void;
  ignoreHeadersAutoFit?: string[];
}

export const MyExcel = {
  export: <T>({
    sheetName = "New SheetName",
    columns,
    data,
    fileName = "Filename",
    cells,
    fileType,
    ignoreHeadersAutoFit = [],

    onComplete,
  }: MyExcelProps<T>) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName, {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    });

    let myNewColumns: MyExcelColumn<T>[] = [];

    worksheet.headerFooter.oddFooter = "Page &P of &N";

    const columnChildren = columns.find((cl) => cl.children);

    if (columnChildren) {
      const maxChildrenColumn = data.reduce((curr, item) => {
        //@ts-ignore
        const childrenLenght = item[columnChildren.key].length;
        if (childrenLenght > curr) {
          return childrenLenght;
        }
        return curr;
      }, 0);

      let newColumns: MyExcelColumn<T>[] = [];

      [...columns].forEach((column, clIndex) => {
        if (column.children) {
          for (let i = 0; i < maxChildrenColumn; i++) {
            column.children.forEach((childColumn) => {
              const currIndex = i + 1;
              const newChildColumn = { ...childColumn };
              newChildColumn.header += ` ${currIndex}`;
              newChildColumn.parentKey = column.key;
              newChildColumn.childrenIndex = i;
              newChildColumn.originKey = newChildColumn.key;
              newChildColumn.key = `${
                (column.key as string) + newChildColumn.key
              }${currIndex}`;
              newColumns.push(newChildColumn);
            });
          }
        } else {
          newColumns.push(column);
        }
      });
      myNewColumns = newColumns;
    } else {
      myNewColumns = columns;
    }

    worksheet.columns = myNewColumns;

    // Tạo header và merge
    worksheet.lastRow?.eachCell((cell, index) => {
      const headerIndex = Math.max(index - 1, 0);
      const currentHeaderCell = myNewColumns[headerIndex];
      cell.style = currentHeaderCell?.headingStyle || {};
      if (currentHeaderCell?.mergeHeader) {
        const mergeRowCount = currentHeaderCell.mergeHeader?.row || 0;
        const mergeColumnCount = currentHeaderCell.mergeHeader?.column || 0;
        worksheet.mergeCells(
          1,
          index,
          mergeRowCount + 1,
          mergeColumnCount + index
        );
      }
    });

    const cellObject = myNewColumns.reduce((final, curr) => {
      if (curr?.render || curr.parentKey) {
        return {
          ...final,
          [curr.key as string]: curr,
        };
      }
      return final;
    }, {});

    data.forEach((row: T, index) => {
      const values = { ...row, ...getFinalValue(row, cellObject, index) };
      worksheet.addRow(values);

      // Gọi hàm onProgress với phần trăm hoàn thành
    });

    // Xử lý cells người dùng tự cập nhật value
    cells?.forEach((item) => {
      const cell = worksheet.getCell(item.position);
      cell.value = item.value;
      cell.style = item?.style || {};
    });

    // Tự động thay đổi độ rộng từng cell
    autoFit(worksheet, ignoreHeadersAutoFit);

    if (fileType === "csv") {
      workbook[fileType].writeBuffer().then(function (buffer: any) {
        saveAs(
          new Blob(["\uFEFF" + buffer], { type: "application/octet-stream" }),
          `${fileName}.${fileType}`
        );
      });
    } else {
      workbook[fileType].writeBuffer().then(function (buffer: any) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          `${fileName}.${fileType}`
        );
      });
    }

    onComplete?.();
  },
  import: (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target?.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wbname = wb.SheetNames[0];

        const ws = wb.Sheets[wbname];

        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

        resolve(data);
      };
    });
  },
};

export async function getExportData<T>({
  limit = 100,
  query,
  api,
  dataField,
  isGetFullData,
  onProgress,
}: {
  limit?: number;
  query?: any;
  dataField?: string;
  api: (params: any) => AxiosPromise<any>;
  isGetFullData?: boolean;
  onProgress: (percent: number) => void;
}) {
  const subQuery = { ...query };
  subQuery.page = 1;
  // debugger;
  let fullData: T[] = [];
  let percentComplete: number = 0;
  let rowsProcessed = 0;

  let i = 1;
  while (true) {
    const res = await api({
      ...subQuery,
      page: i,
      limit: limit,
    });

    const totalRows = res.data.total; //Tổng dòng của data
    rowsProcessed++;
    percentComplete = ((rowsProcessed * limit) / totalRows) * 100;
    onProgress(percentComplete);

    // *Dừng lấy data khi data trong response = 0
    if (!res.data[dataField as string].length) {
      break;
    }

    fullData = [...fullData, ...res.data[dataField as string]];
    i++;

    // *Chỉ lấy data cho lần query đầu tiên
    if (!isGetFullData) {
      break;
    }
  }

  return fullData;
}

// Function to export rows and update progress

interface IHandleExport<T> {
  exportColumns: MyExcelColumn<T>[];
  query?: any;
  fileType: "xlsx" | "csv";
  dataField?: string;
  api: (params: any) => AxiosPromise<any>;
  fileName: string;
  sheetName: string;
  limit?: number;
  isGetFullData?: boolean; //* Lấy toàn bộ các trang
  onProgress: (percent: number) => void;
  onComplete?: () => void;
}

export const handleExport = async <T>({
  exportColumns,
  query,
  fileType,
  dataField,
  api,
  fileName,
  sheetName,
  limit = 50,
  isGetFullData = true,
  onProgress,
  onComplete,
}: IHandleExport<T>) => {
  try {
    // debugger
    const fullData = await getExportData<T>({
      limit,
      dataField,
      api,
      query,
      isGetFullData,
      onProgress,
    });

    // debugger;

    MyExcel.export<T>({
      sheetName,
      columns: exportColumns,
      fileName,
      fileType,
      data: fullData,
      onProgress: (percent) => percent,
      onComplete,
    });
  } catch (error) {
    console.log(error);
    message.error("Có lỗi xảy ra, vui lòng thử lại!");
  }
};
