import UAParser from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";

export const initUUID = () => {
  const localUuid = localStorage.getItem("uuid");
  if (!localUuid) {
    const uuid = uuidv4();
    localStorage.setItem("uuid", uuid);
  }
};

export const getDeviceInfo = () => {
  let parser = new UAParser();

  const deviceId = localStorage.getItem("uuid") || "";
  const deviceName = parser.getUA();
  return { deviceId, deviceName };
};

export function iOS() {
  return UAParser().os.name == "iOS";
}

export const deviceWidth = window.innerWidth;

export const showUIBasedOnDeviceWidth = (width: number) => {
  return deviceWidth >= width ? true : false;
};
