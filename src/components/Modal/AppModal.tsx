import { Form, FormInstance, Modal, ModalProps } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props extends Omit<ModalProps, "children"> {
  children: (data: {
    data: any;
    close: () => void;
    open: (data: any) => void;
    setData: (data: any) => void;
    form: FormInstance<any>;
  }) => React.ReactNode | React.ReactNode;
}

export interface AppModalAction {
  open: (data: any) => void;
  close: () => void;
  setData: (data: any) => void;
}

const AppModal = forwardRef(({ children, ...modalProps }: Props, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState();
  const [form] = Form.useForm();

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      setData: setData,
      open: (data: any) => {
        setData(data);
        handleOpen();
      },
      close: () => {
        handleClose();
      },
    }),
    []
  );

  const content =
    typeof children == "function"
      ? children({
          data,
          close: handleClose,
          open: handleOpen,
          setData,
          form: form,
        })
      : children;

  return (
    <Modal onCancel={handleClose} {...modalProps} open={isOpen}>
      {content}
    </Modal>
  );
});

export default AppModal;
