import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Space } from "antd";
import React, { useImperativeHandle, useState } from "react";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";

import "./style/imageDND.scss";

export interface ImagesDND {
  handleOpen: (imageRef: string[]) => void;
}

export const ImagesDND = React.forwardRef(
  (
    {
      onUpdateFileList,
    }: {
      onUpdateFileList: (FileList: string[]) => void;
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [fileList, setFileList] = useState<string[]>([]);

    useImperativeHandle(
      ref,
      () => {
        return {
          handleOpen(fileList: string[]) {
            setFileList([...fileList]);
            setVisible(true);
          },
        };
      },
      []
    );

    const handleUpdatePos = async () => {
      setLoading(true);
      try {
        onUpdateFileList(fileList);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    const onClose = () => {
      setVisible(false);
    };

    // const [items, setItems] = React.useState([1, 2, 3, 4]); // supply your own state

    function onChange(
      sourceId: any,
      sourceIndex: any,
      targetIndex: any,
      targetId: any
    ) {
      const nextState = swap(fileList, sourceIndex, targetIndex);
      setFileList(nextState);
    }

    return (
      <Modal
        onOk={handleUpdatePos}
        title="Thay đổi vị trí"
        visible={visible}
        onCancel={onClose}
        confirmLoading={loading}
        width={800}
        centered
      >
        <Space style={{ marginBottom: "1em" }}>
          <InfoCircleOutlined />
          <p style={{ marginBottom: 0 }}>Kéo thả ảnh để thay đổi vị trí</p>
        </Space>
        <GridContextProvider onChange={onChange}>
          <GridDropZone
            id="items"
            boxesPerRow={6}
            rowHeight={120}
            style={{ minHeight: "70vh" }}
          >
            {fileList.map((item) => (
              <GridItem key={item}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    marginBottom: "1em",
                  }}
                >
                  <img
                    className="dragImage"
                    onDragStart={(e) => {
                      e.preventDefault();
                    }}
                    src={item}
                    alt=""
                    width={100}
                  />
                </div>
              </GridItem>
            ))}
          </GridDropZone>
        </GridContextProvider>
      </Modal>
    );
  }
);
