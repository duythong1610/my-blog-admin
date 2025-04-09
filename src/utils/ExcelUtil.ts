import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";

export class ExcelUtil {
  static readExcel = (
    file: any,
    otps?: XLSX.Sheet2JSONOpts,
    readOpts?: XLSX.ParsingOptions,
    sheetName?: string
  ) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target?.result;

        const wb = XLSX.read(bufferArray, { type: "buffer", ...readOpts });

        const wbname = wb.SheetNames[0];

        const ws = wb.Sheets[sheetName ?? ""] || wb.Sheets[wbname];

        const data = XLSX.utils.sheet_to_json(ws, otps);

        resolve(data);
      };

      fileReader.onerror = () => {
        reject("Lỗi khi đọc file");
      };
    });
  };
  static async parseFileToWb(file: File) {
    const wb = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await wb.xlsx.load(buffer);
    return wb;
  }
}
