import dayjs from "dayjs";
import moment from "moment";

export function formatDate(timestamp: number, format = "DD/MM/YYYY") {
  return moment.unix(timestamp).format(format);
}

export function formatFullDateTime(timestamp: number) {
  return moment.unix(timestamp).format("HH:mm:ss, DD/MM/YYYY");
}

export function formatDateDay(timestamp: number) {
  return moment.unix(timestamp).format("dddd, MM-DD-YYYY");
}

export function generateTimeSeries(
  step: number,
  addHour = 0,
  format = "h:mm a"
) {
  const dt = new Date(1970, 0, 1);
  const rc = [];
  while (dt.getDate() === 1) {
    rc.push(moment(dt).add(addHour, "hour").format(format));
    // rc.push(dt.toLocaleTimeString('en-US'))
    dt.setMinutes(dt.getMinutes() + step);
  }
  return rc;
}

export function generateDuration() {
  let seconds = 300;
  const durations = [];
  while (seconds <= 60 * 60 * 12) {
    const h = Math.floor(seconds / 3600);
    const m = (seconds % 3600) / 60;
    let label = secondToMinuteString(seconds);
    durations.push({
      label,
      value: seconds,
    });
    seconds += 300;
  }
  return durations;
}

export function secondToMinuteString(second: number) {
  const h = Math.floor(second / 3600);
  const m = (second % 3600) / 60;
  let label = "";
  if (h == 0) {
    label = `${m}m`;
  } else {
    if (m == 0) {
      label = `${h}h`;
    } else {
      label = `${h}h ${m}m`;
    }
  }
  return label;
}

export function handleDateRange(startAt: number, endAt: number) {
  return [moment(startAt * 1000), moment(endAt * 1000)];
}

export const dateRanges: any = {
  "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
  "Hôm qua": [
    moment().subtract(1, "days").startOf("day"),
    moment().subtract(1, "days").endOf("day"),
  ],
  "Tuần này": [moment().startOf("week"), moment().endOf("week")],
  "Tuần trước": [
    moment().subtract(1, "weeks").startOf("week"),
    moment().subtract(1, "weeks").endOf("week"),
  ],
  "Tháng này": [moment().startOf("month"), moment().endOf("month")],
  "Tháng trước": [
    moment().subtract(1, "months").startOf("month"),
    moment().subtract(1, "months").endOf("month"),
  ],
};

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format("HH:mm DD/MM/YYYY");
}
