import { ErrorLog, ImportExcelCol } from "utils/importExcel";
import { ValidateData } from "./ValidateData";

export class ValidateImportData extends ValidateData {
  importColumns: ImportExcelCol<any, any>[] = [];
  constructor(props: Partial<ValidateImportData>) {
    super();
    Object.assign(this, props);
  }

  validate<T>(data: T, startRow: number) {
    const currError: ErrorLog[] = [];
    Object.values(this.importColumns).forEach((col) => {
      const val = data?.[col.key as keyof T];
      col.validate?.forEach((v) => {
        if (v.type) {
          //@ts-ignore
          const error = this[v.type]?.({
            val,
            name: col.title as string,
            errorType: v.errorType,
            message: v.errorMessage,
            startRow,
            key: col.key as string,
          });
          if (error) {
            currError.push(error);
          }
        } else {
          const message = v.validate?.(val, data);
          if (message) {
            const error = { message: v.errorMessage, type: v.errorType };
            //@ts-ignore
            currError.push(error);
            //@ts-ignore
            this.errors.push(error);
          }
        }
      });
    });

    return currError;
  }
}
