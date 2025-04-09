import { Rule } from "antd/lib/form";

export const rules: Rule[] = [
  {
    required: true,
    message: "Bắt buộc!",
  },
];
export const wordAndNumberOnlyRule: Rule = {
  message: "Vui lòng nhập chữ và số!",
  validator(rule, value, callback) {
    const text = String(value);
    const wordMatched = text.match(
      /[^A-Za-z0-9]|[àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]+/g
    );

    const isValid = !wordMatched;

    if (isValid) {
      return Promise.resolve();
    }
    return Promise.reject();
  },
};
export const minRuleCustom = (min: number = 6): Rule => ({
  min: min,
  type: "string",
  message: `Vui lòng nhập ít nhất ${min} ký tự!`,
});
export const minRule: Rule = minRuleCustom();

export const requiredRule: Rule = {
  required: true,
  message: "Bắt buộc nhập!",
};

export const emailRule: Rule = {
  type: "email",
  message: "Vui lòng nhập email!",
};

export const phoneNumberRule: Rule = {
  pattern: /((0|84)+[3|5|7|8|9])+([0-9]{8})\b/g,
  message: "Số điện thoại sai định dạng.",
};

export const validateRules = {
  phone: {
    // pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    pattern:
      /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/i,
    message: "Vui lòng nhập số điện thoại",
    required: true,
  },
};

import { RuleObject } from "antd/es/form";

export const phoneValidate = [
  {
    validator: async (_: RuleObject, value: any) => {
      if (value) {
        try {
          const { isValid } = await validateNumber(value);
          if (!isValid) {
            return Promise.reject("Định dạng không hợp");
          }
          const input = value as string;

          if (input[input.length - 1] == " " || input[0] == " ") {
            return Promise.reject(
              "Vui lòng không nhập khoảng trắng trước và sau số"
            );
          }
        } catch (error) {
          return Promise.reject("Định dạng không hợp");
        }
      }

      return Promise.resolve();
    },
  },
];
export const validateNumber = async (phone: string, unit = "VN") => {
  const { isValidNumber, parsePhoneNumber } = await import("libphonenumber-js");
  const phoneParsed = parsePhoneNumber(phone, "VN");
  const phoneRequest = phoneParsed.number.replace("+84", "0");

  return {
    //@ts-ignore
    isValid: isValidNumber(phone, "VN"),
    phoneParsed: phoneParsed.number,
    finalPhone: phoneRequest,
  };
};
