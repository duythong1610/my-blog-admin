import moment from "moment";
import { ShoppingPlaceTrans } from "types/custom";
import { PurchaseForTrans } from "types/purchase";
import {
  Receipt,
  ReceiptStatusTrans,
  ReceiptType,
  ReceiptTypeTrans,
} from "types/receipt";
import { SurveyCampaign } from "types/survey";
import { formatVND } from "utils";
import { unixToFullDate } from "utils/dateFormat";
import { MyExcelColumn } from "utils/MyExcel";

export const exportReceiptColumns: MyExcelColumn<Receipt>[] = [
  {
    header: "Mã",
    headingStyle: {
      font: { bold: true },
    },
    key: "code",
    render: (record: Receipt) => record.code || "--",
  },
  {
    header: "Nơi mua",
    headingStyle: {
      font: { bold: true },
    },
    key: "address",
    render: (record: Receipt) =>
      //@ts-ignore
      ShoppingPlaceTrans[record.address]?.label || "--",
  },
  {
    header: "Loại mua sắm",
    headingStyle: {
      font: { bold: true },
    },
    key: "type",
    render: (record: Receipt) => ReceiptTypeTrans[record.type]?.label || "--",
  },
  {
    header: "Mua cho",
    headingStyle: {
      font: { bold: true },
    },
    key: "purchaseFor",
    render: (record: Receipt) =>
      PurchaseForTrans[record.purchaseFor]?.label || "--",
  },
  {
    header: "Chi tiết mua sắm",
    headingStyle: {
      font: { bold: true },
    },
    key: "receiptDetails",
    render: (record: Receipt) => {
      if (record.type === ReceiptType.NoReceipt) {
        return record.receiptDetails
          .map(
            (item) =>
              `Sản phẩm: "Chưa có dữ liệu", Giá: ${
                formatVND(item.price) || "Chưa có giá"
              }, Số lượng: ${item.quantity || "Chưa có số lượng"}`
          )
          .join("\r\n");
      } else {
        return "Có hóa đơn";
      }
    },
  },

  {
    header: "Tổng giá trị",
    headingStyle: {
      font: { bold: true },
      alignment: {
        horizontal: "right",
      },
    },
    style: { alignment: { horizontal: "right" } },

    key: "moneyFinal",
    render: (record: Receipt) => formatVND(record.moneyFinal) || "",
  },
  {
    header: "Trạng thái",
    headingStyle: {
      font: { bold: true },
    },
    key: "status",
    render: (record: Receipt) =>
      ReceiptStatusTrans[record.status]?.label || "--",
  },
  {
    header: "Ngày gửi",
    headingStyle: {
      font: { bold: true },
    },
    key: "receiptAt",
    render: (record: Receipt) => unixToFullDate(record.receiptAt) || "--",
  },
  {
    header: "Ngày mua",
    headingStyle: {
      font: { bold: true },
    },
    key: "createdAt",
    render: (record: Receipt) => unixToFullDate(record.createdAt) || "--",
  },
];
