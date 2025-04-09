import { Input, InputProps } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { formatVND } from "utils";

interface InputNumber extends InputProps {}

export const InputNumber = (props: InputNumber) => {
  const [currentValue, setCurrentValue] = useState("");
  const prevValue = useRef("");

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value.replaceAll(",", "");
    var reg = /^\d+$/;

    if (reg.test(value)) {
      ev.currentTarget.value = ev.currentTarget.value.replaceAll(",", "");
      prevValue.current = ev.currentTarget.value;
    } else {
      if (value == "") {
        ev.currentTarget.value = "";
      } else {
        ev.currentTarget.value = prevValue.current;
      }
    }
    props.onChange?.(ev);
  };

  useEffect(() => {
    if (
      props.value === 0 ||
      (props.value && (typeof props.value == "string" || !isNaN(+props.value)))
    ) {
      setCurrentValue(formatVND(+props.value));
    } else {
      setCurrentValue("");
    }
  }, [props.value]);

  return (
    <Input {...props} onChange={handleChange} value={currentValue}></Input>
  );
};
