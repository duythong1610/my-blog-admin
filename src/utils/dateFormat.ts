import moment from "moment";
import { format } from "path";
import { settings } from "settings";

export const unixToFullDate = (unix: number) => {
  return unix ? moment.unix(unix).format(settings.fullDateFormat) : null;
};

export const unixToDate = (unix: number) => {
  return moment.unix(unix).format(settings.dateFormat);
};
