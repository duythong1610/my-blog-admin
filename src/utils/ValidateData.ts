import dayjs from "dayjs";
import { ErrorLog } from "utils/importExcel";

export abstract class ValidateData {
  errors: ErrorLog[] = [];
  uniqueData: Record<string, any[]>;
  constructor() {
    this.errors = [];
    this.uniqueData = {};
  }
  abstract validate<T>(data: T, startRow: number): void;

  getErrors(type?: ErrorLog["type"]) {
    return this.errors.filter((e) => (e.type ? e.type == type : true));
  }

  hasValue(value: any) {
    return value !== null && value !== undefined && (value + "").trim() !== "";
  }

  unique({
    val,
    name,
    key,
    message,
    startRow,
    errorType,
  }: DefaultValidateParams) {
    if (this.hasValue(val) && key && errorType) {
      const isExist = this.uniqueData?.[key]?.includes(val);
      if (isExist) {
        const findIndex = this.uniqueData?.[key]?.indexOf(val) + 1;
        const error = {
          message:
            message ||
            `Cột dữ liệu "${name}" đã tồn tại trước đó, tại dòng số ${
              findIndex + (startRow || 0)
            }.`,
          type: errorType,
        };
        this.errors.push(error);
        return error;
      } else {
        if (!this.uniqueData[key]) {
          this.uniqueData[key] = [val];
        } else {
          this.uniqueData[key].push(val);
        }
      }
    }
  }

  required({
    val,
    name,
    errorType = "danger",
    message,
  }: DefaultValidateParams) {
    if (!this.hasValue(val)) {
      const error = {
        message: message || `Cột dữ liệu "${name}" là bắt buộc!`,
        type: errorType,
      };
      this.errors.push(error);
      return error;
    }
  }

  date({ val, message, name, errorType }: DefaultValidateParams) {
    const dateJs = dayjs(val as string);
    if (errorType) {
      if (dateJs.isValid()) {
      } else {
        const error = {
          message: message || `Cột dữ liệu "${name}" sai dữ liệu!`,
          type: errorType,
        };
        this.errors.push(error);
        return error;
      }
    }
  }
}
export interface DefaultValidateParams {
  val: any;
  name: string;
  key?: string;
  errorType?: ErrorLog["type"];
  message?: string;
  startRow?: number;
}
