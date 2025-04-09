import * as XLSX from "xlsx";

export const readerData = (
  file: File,
  sheetName: number = 0,
  range = 0,
  opts?: XLSX.ParsingOptions
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array", ...opts });

      //   const sheetName = this.sheetName || "0";
      const firstSheetName = workbook.SheetNames[sheetName];
      const worksheet = workbook.Sheets[firstSheetName];
      const header = getHeaderRow(worksheet);
      const results = XLSX.utils.sheet_to_json(worksheet, { range });
      //   generateData({ header, results });
      resolve({ header, results });
    };
    reader.readAsArrayBuffer(file);
  });
};

const getHeaderRow = (sheet: any) => {
  const headers = [];
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  let C;
  const R = range.s.r;
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
    /* find the cell in the first row */
    let hdr = "UNKNOWN " + C; // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    headers.push(hdr);
  }
  return headers;
};
