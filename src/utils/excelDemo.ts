import * as ExcelJS from "exceljs";
import saveAs from "file-saver";
import { ImportExcelCol } from "./importExcel";

export class ExportImportExcelDemoFile<T, P extends Object> {
  workbook: ExcelJS.Workbook;
  demoSheet!: ExcelJS.Worksheet;
  columns: ImportExcelCol<T, P>[];
  constructor(columns: ImportExcelCol<T, P>[], workbook?: ExcelJS.Workbook) {
    this.workbook = workbook || new ExcelJS.Workbook();
    this.columns = columns;
  }

  addDemoSheet(demoSheetName: string) {
    this.demoSheet = this.workbook.addWorksheet(demoSheetName, {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    });

    //@ts-ignore
    this.demoSheet.columns = this.columns as ExcelJS.Column[];

    const headerRow = this.demoSheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 12,
      };
    });
    console.log(this.columns);
    const columnHasSelectBox = this.columns.filter((col) => col.select);

    // add dữ liệu select đến các cột được khai báo
    if (columnHasSelectBox.length) {
      columnHasSelectBox.forEach((column) => {
        const excelColumn = this.demoSheet.getColumn(column.key as string);
        const columnLetter = excelColumn.letter;
        const currRow = this.demoSheet.rowCount;
        const startCellAddress = `${columnLetter}${currRow}`;
        const endCellAddress = `${columnLetter}999999`;

        if (column.select?.sheetName && column.select.valueKey) {
          const referenceSheet = this.workbook.getWorksheet(
            column.select?.sheetName as string
          );

          const referenceCellLetter = referenceSheet?.getColumn(
            column.select?.valueKey as string
          ).letter;

          const referenceColumnAddress = `'${
            column.select?.sheetName as string
          }'!$${referenceCellLetter}$3:$${referenceCellLetter}$${
            referenceSheet?.rowCount
          }`;

          //@ts-ignore
          this.demoSheet?.dataValidations?.add(
            `${startCellAddress}:${endCellAddress}`,
            {
              type: "list",
              allowBlank: false,
              formulae: [referenceColumnAddress],
            }
          );
        } else {
          const formuleData = '"' + column.select?.data?.join(",") + '"';
          //@ts-ignore
          this.demoSheet?.dataValidations?.add(
            `${startCellAddress}:${endCellAddress}`,
            {
              type: "list",
              allowBlank: false,
              formulae: [formuleData],
            }
          );
        }
      });
    }
  }

  autoWidth = (worksheet: ExcelJS.Worksheet) => {
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      //@ts-ignore
      column?.["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 20;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 20 ? 20 : maxLength;
    });
  };

  addReferenceSheet<T>(
    data: T[],
    sheetName: string,
    columns: ImportExcelCol<T, P>[]
  ) {
    //Khai báo sheet
    const sheet = this.workbook.addWorksheet(sheetName, {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      state: "veryHidden",
    });
    //Khai báo giá trị của từng column
    //@ts-ignore
    sheet.columns = columns as ExcelJS.Column[];
    // Khai báo heading
    const headingRow = sheet.getRow(1);
    headingRow.getCell(1).value = sheetName;
    headingRow.getCell(1).alignment = { horizontal: "center" };
    headingRow.getCell(1).font = { size: 15, bold: true };
    headingRow.getCell(1).border = {
      bottom: {
        style: "thin",
        color: {
          argb: "000000",
        },
      },
    };
    //Merge Cell heading
    sheet.mergeCells(1, 1, 1, columns.length);

    //Khai báo title
    const titleRow = sheet.getRow(2);
    console.log("columns", columns);

    columns.forEach((title, index) => {
      titleRow.getCell(index + 1).value = title.header as string;
      titleRow.getCell(index + 1).font = {
        bold: true,
      };
      titleRow.getCell(index + 1).alignment = {
        horizontal: "center",
      };
    });

    //Add từng row
    // console.log(data);
    sheet.addRows(data);

    //Fit width
    this.autoWidth(sheet);

    return sheet;
  }

  init(demoSheetName: string) {
    this.addDemoSheet(demoSheetName);
  }

  download(fileName: string) {
    this.workbook.xlsx.writeBuffer().then(function (buffer: any) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        fileName
      );
    });
  }
}
