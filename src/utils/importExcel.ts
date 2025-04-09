import dayjs from "dayjs";
import { MyTableColumn } from "./excel";
import { isObjectExist } from "./data";
import { RcFile } from "antd/lib/upload";
import { ValidateImportData } from "./ValidateImportData";
import { ExcelUtil } from "./ExcelUtil";

export type ImportExcelDataType<T> = T & {
  errorMessage: string;
  rowNum: number;
};

export interface ImportExcelCol<T, CP extends Object = Object>
  extends Omit<MyTableColumn<T>, "key"> {
  key: keyof T | string;
  validate?: {
    type?: "required" | "unique" | "date";
    errorType?: ErrorLog["type"];
    errorMessage?: string;
    validate?: (val: any, data: T) => string;
  }[];
  select?: {
    sheetName?: string;
    valueKey?: string;
    data?: string[];
  };
  getValue?: (val: any) => any;
  customProps?: (params: CP) => Partial<ImportExcelCol<T>>;
}

export interface ErrorLog {
  message: string;
  type: "danger" | "warning";
}

export interface ImportData<T> {
  errors: ErrorLog[];
  result: T[];
}
export type ValidateUniqueData<T> = {
  [key in keyof T]?: {
    name: string;
    value: any[];
  };
};

export const validateDateData = <T>(data: T, col: ImportExcelCol<T>) => {
  const errors: ErrorLog[] = [];
  const dateJs = dayjs(data?.[col.key as keyof T] as string);
  if (dateJs.isValid()) {
  } else {
    errors.push({
      message: `Cột dữ liệu "${col.title}" sai dữ liệu!`,
      type: "danger",
    });
  }
  return errors;
};

export function checkRequired<T>(data: T, requiredCol: ImportExcelCol<T>[]) {
  const errors: ErrorLog[] = [];

  if (!requiredCol.length) return errors;

  requiredCol.forEach((col) => {
    const value = data[col.key as keyof T];
    if (!value || !String(value).trim()) {
      errors.push({
        message: `Cột dữ liệu "${col.title}" là bắt buộc!`,
        type: "danger",
      });
    }
  });

  return errors;
}

export function checkUnique<T>(
  data: T,
  uniqueData: ValidateUniqueData<T>,
  startRow: number
) {
  const errors: ErrorLog[] = [];

  if (!isObjectExist(uniqueData)) return errors;

  Object.entries(uniqueData).forEach(([key, val]) => {
    const finalKey = key as keyof T;
    const finalVal = val as (typeof uniqueData)[typeof finalKey];
    const value = data[finalKey];
    if (value && String(value).trim()) {
      const isExist = finalVal!.value?.includes(value);
      if (isExist) {
        const findIndex = finalVal!.value?.indexOf(value) + 1;
        errors.push({
          type: "danger",
          message: `Cột dữ liệu "${
            finalVal!.name
          }" đã tồn tại trước đó, tại dòng số ${findIndex + startRow}.`,
        });
      }

      uniqueData[finalKey]!.value.push(value);
    }
  });

  return errors;
}

export const parseUniqueData = <T>(uniqueCol: ImportExcelCol<T>[]) => {
  let uniqueData: ValidateUniqueData<T> = {};

  Object.values(uniqueCol).forEach((value) => {
    Object.assign(uniqueData, {
      [value.key as keyof T]: {
        value: [],
        name: value.title,
      },
    });
  });

  return uniqueData;
};

export function convertUTCDateToLocalDate(date: string | Date) {
  let currDate = date;
  if (currDate instanceof Date) {
    return new Date(
      currDate.getTime() - currDate.getTimezoneOffset() * 60 * 1000
    );
  }
  return date;
}

export function getImportColumns<C, P extends Object = {}>(
  col: ImportExcelCol<C, P>[],
  props: P
) {
  return col
    .map((v) => ({
      ...v,
      ...(v?.customProps?.(props) || {}),
      dataIndex: v.key,
    }))
    .filter((v) => !v.hidden) as ImportExcelCol<C, P>[];
}

export class ImportExcelData<T, C extends Object> {
  file: RcFile;
  includesFile: string[] = ["xlsx", "xls", "csv"];
  columns: ImportExcelCol<T, C>[] = [];
  importColumns: ImportExcelCol<T, C>[] = [];
  validateData: ValidateImportData;
  constructor(props: Partial<ImportExcelData<T, C>>) {
    Object.assign(this, props);
    this.file = props.file!;
    this.validateData = new ValidateImportData({
      importColumns: props.importColumns,
    });
  }

  getColumns = getImportColumns<T, C>;

  validateFileType() {
    const extension = this.file.name.substring(
      this.file.name.lastIndexOf(".") + 1
    );
    const isValid = this.includesFile.includes(extension);
    if (!isValid) {
      throw new Error("File không đúng định dạng");
    }
  }

  async findHeaderRow(sheetName: string | number) {
    let headers: string[] = [];
    let range: number = 0;
    const wb = await ExcelUtil.parseFileToWb(this.file);

    let ws = wb.worksheets.find(
      (sheet, index) =>
        sheet.state == "visible" &&
        (sheet.name == sheetName || index == sheetName)
    );

    if (!ws) {
      ws = wb.worksheets.find(
        (sheet, index) => !!sheet && sheet.state == "visible"
      );
    }

    const headerColumns = this.columns.map((col) => col.title);

    for (let index = 0; index < ws!.actualRowCount; index++) {
      // Change from actualColumnCount to actualRowCount
      const row = ws!.getRow(index);
      const rowValue = row.values;

      if (!rowValue || rowValue.length === 0) {
        continue; // Skip empty rows
      }

      // Handle case when there's only one column
      const formattedRow = Array.isArray(rowValue) ? rowValue : [rowValue];

      const isHeader = formattedRow.some((v) => {
        //@ts-ignore
        const text = ((v?.richText?.[0]?.text || v) + "").trim();
        return headerColumns.includes(text);
      });

      if (isHeader) {
        //@ts-ignore
        headers = formattedRow.filter(Boolean).map((v: any) => {
          const text = ((v?.richText?.[0]?.text || v) + "").trim();
          return text.toLowerCase();
        });

        range = index;
        break;
      }
    }

    return { headers, range, ws };
  }

  async parseExcelRowToData(
    params: Omit<Parameters<(typeof ExcelUtil)["readExcel"]>, "0">
  ) {
    //@ts-ignore
    return await ExcelUtil.readExcel(this.file, ...params);
  }

  parseData(originData: T) {
    const colHasCustomVal = this.columns.filter((c) => !!c.getValue);
    colHasCustomVal.forEach((v) => {
      const originVal = originData?.[v.key as keyof T];
      //@ts-ignore
      Object.assign(originData, {
        //@ts-ignore
        [v.key]: v.getValue(originVal),
      });
    });
    return originData as ImportExcelDataType<T>;
  }

  async readData(sheetName?: string) {
    console.log(sheetName);
    const { headers, range } = await this.findHeaderRow(sheetName ?? "");
    // console.log(headers);
    if (!!headers.length) {
      const parsedData: ImportExcelDataType<T>[] = [];

      const headerNames = this.columns
        .filter((col) =>
          headers.includes(col.title?.toString().toLowerCase() as string)
        )
        .map((col) => col.key) as string[];

      //đọc dư liệu từ excel
      const data = (await ExcelUtil.readExcel(
        this.file,
        {
          header: headerNames,
          range,
        },
        {
          type: "array",
          cellDates: true,
          dateNF: "DD/MM/YYYY",
        },
        sheetName
      )) as T[];

      if (data?.length) {
        console.log("origin data: ", data);
        console.log("import header: ", headerNames);

        //parse dữ liệu và validate ( add row num, error message)
        data.forEach((row, index) => {
          const parsed = this.parseData(row);

          const errors = this.validateData.validate(parsed, range);

          const errorMessage = errors.map((v) => v.message).join("\n");

          Object.assign(parsed, {
            rowNum: index + range + 1,
            errorMessage,
          });

          parsedData.push(parsed);
        });

        return {
          data: parsedData,
          dangerErrors: this.validateData.getErrors("danger"),
          warningsErrors: this.validateData.getErrors("warning"),
        };
      } else {
        throw new Error("Không có dữ liệu");
      }
    } else {
      throw new Error("Vui lòng kiểm tra lại tiêu đề các cột so với file mẫu!");
    }
  }
}
