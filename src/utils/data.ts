import { Dayjs } from "dayjs";
import { QueryParam } from "types/query";
import { MyTableColumn } from "./excel";

export const getRangerDateFilter = (dates: Dayjs[]) => {
  return {
    fromDate: dates[0].startOf("day").format("YYYY-MM-DD"),
    toDate: dates[1].endOf("day").format("YYYY-MM-DD"),
  };
};

export const getVisibleTableColumns = (columns: MyTableColumn[]) => {
  return columns.filter((c) => !c.hidden);
};

export const isObjectExist = (obj: Record<string, any>) => {
  return !!Object.keys(obj).length;
};
