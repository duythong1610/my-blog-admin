import { UploadOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { Sources } from "quill";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { $url } from "utils/url";
import { UploadImageModal } from "./components/UploadImageModal";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "formula"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { list: "check" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ direction: "rtl" }],
    [{ script: "sub" }, { script: "super" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ font: [] }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "size",
  "color",
  "direction",
  "font",
  "code-block",
  "script",
];

interface IRichTextEditorV2 extends Partial<ReactQuill> {
  onChange: (content: string) => void;
  content: string;
  label?: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
}

export const RichTextEditorV2 = memo(function RichTextEditorV2({
  onChange,
  content = "",
  label,
  minHeight = 500,
  maxHeight = 500,
  ...reactQuillProps
}: IRichTextEditorV2) {
  const [visibleUploadModal, setVisibleUploadModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [loadingRender, setLoadingRender] = useState(true);

  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const containers = document.getElementsByClassName(
      "ql-container"
    ) as HTMLCollectionOf<HTMLDivElement>;
    for (let i = 0; i < containers.length; i++) {
      const element = containers[i];
      element.style.maxHeight = `${maxHeight}px`;
      element.style.minHeight = `${minHeight}px`;
      element.style.overflowY = "scroll";
    }

    setTimeout(() => {
      setLoadingRender(false);
    }, 100);
  }, []);

  const onEditorChange = (content: string) => {
    onChange(content);
  };

  const reactQuillComponent = useMemo(
    () => (
      <ReactQuill
        theme="snow"
        className="[&_.ql-editor]:h-[500px]"
        value={content}
        onChange={onEditorChange}
        onChangeSelection={(
          selection: ReactQuill.Range,
          source: Sources,
          editor: ReactQuill.UnprivilegedEditor
        ) => {
          if (selection) {
            setCursorPosition(selection?.index || 0);
          }
        }}
        modules={modules}
        formats={formats}
        ref={editorRef}
        {...reactQuillProps}
      />
    ),
    [content]
  );

  return (
    <>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={{ textAlign: "right", marginBottom: 12 }}>
        <Button
          icon={<UploadOutlined />}
          onClick={() => setVisibleUploadModal(true)}
          type="primary"
        >
          Upload ảnh
        </Button>
      </div>
      {loadingRender ? <Spin /> : reactQuillComponent}
      {visibleUploadModal && (
        <UploadImageModal
          onClose={() => setVisibleUploadModal(false)}
          onSubmitOk={(path) => {
            setVisibleUploadModal(false);
            editorRef.current?.editor?.insertEmbed(
              cursorPosition,
              "image",
              `${$url(path)}`
            );
          }}
          visible={visibleUploadModal}
        />
      )}
    </>
  );
});
