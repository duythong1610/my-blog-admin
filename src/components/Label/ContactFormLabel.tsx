import { Badge } from "antd";
import { observer } from "mobx-react";
import React from "react";
import { contactFormStore } from "store/contactFormStore";

interface IProps {
  title: string;
}

export const ContactFormLabel = observer(({ title }: IProps) => {
  return (
    <div className="flex gap-2 items-center !w-full">
      <span>{title}</span>
      <Badge count={contactFormStore.totalNewContact} />
    </div>
  );
});
