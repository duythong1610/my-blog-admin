import { Rule, RuleObject } from "antd/es/form";

export const requiredRule: Rule = {
  required: true,
  message: "Bắt buộc nhập!",
};
export const minRuleCustom = (min: number = 6): Rule => ({
  min: min,
  type: "string",
  message: `Vui lòng nhập ít nhất ${min} ký tự!`,
});
export const minRule: Rule = minRuleCustom();

export const emailRule: Rule = {
  type: "email",
  message: "Vui lòng nhập email!",
};
export const positiveIntegersRule: Rule = {
  message: "Vui lòng nhập số nguyên dương!",
  validator: (_, value) => {
    if (value < 0) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
};
export const betweenValueRule = ({
  min,
  max,
  customMessage,
}: {
  min: number;
  max: number;
  customMessage?: string;
}): Rule => {
  return {
    message: customMessage || `Giá trị phải nhỏ hơn ${min} và lớn hơn ${max}`,
    validator: (_, value) => {
      if (value < min || value > max) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
  };
};
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
          console.log("validate phone number error: ", error);

          return Promise.reject("Định dạng không hợp");
        }
      }

      return Promise.resolve();
    },
  },
];
export const validateNumber = async (phone: string, unit = "VN") => {
  //@ts-ignore
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
