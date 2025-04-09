import { UploadOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Spin } from "antd";
import React, { useImperativeHandle, useState } from "react";
import { $url } from "utils/url";
import { UploadImageModal } from "./components/UploadImageModal";

let editorRef: any = null;

interface IRichTextEditor {
  onChange: (content: string) => void;
  onInit: () => void;
  inputHeight?: number;
  uploadUrl?: string;
}

export interface IRichTextEditorRef {
  setContent(content: string): void;
}

export const RichTextEditor = React.forwardRef(
  (
    { onChange, onInit, inputHeight = 500, uploadUrl }: IRichTextEditor,
    ref
  ) => {
    const [initValue, setInitValue] = useState("");
    useImperativeHandle(ref, () => ({
      setContent: (content: string) => {
        editorRef?.setContent(content);
        setInitValue(content);
      },
    }));
    const [isEditorReady, setIsEditorReady] = useState(false); //* Thể hiện loading khi RichTextEditor chưa hiện lên UI
    const [visibleUploadModal, setVisibleUploadModal] = useState(false);

    return (
      <>
        <div style={{ textAlign: "right", marginBottom: 12 }}>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setVisibleUploadModal(true)}
            type="primary"
          >
            Upload ảnh
          </Button>
        </div>
        {!isEditorReady && (
          <Spin
            style={{
              width: "100%",
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            spinning={true}
          ></Spin>
        )}
        <Editor
          apiKey={"923po5tbgnwstfb9wxgmv2ypnkrme2an4resuo5a0ezyfxch"}
          onInit={(evt, editor) => {
            editorRef = editor;
            setIsEditorReady(true);
            onInit?.();
          }}
          onEditorChange={(val) => {
            onChange(val);
          }}
          initialValue={initValue}
          init={{
            entity_encoding: "numeric",
            height: inputHeight,
            menubar: true,
            convert_urls: true,
            relative_urls: false,
            remove_script_host: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount emoticons",
              "Enhanced Image",
            ],
            toolbar:
              "undo redo | formatselect | image emoticons | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | forecolor fontsizeselect | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
          }}
        />
        {visibleUploadModal && (
          <UploadImageModal
            uploadUrl={uploadUrl}
            onClose={() => setVisibleUploadModal(false)}
            onSubmitOk={(path) => {
              setVisibleUploadModal(false);
              console.log(editorRef);
              editorRef.insertContent(`<img src="${$url(path)}"/>`);
            }}
            visible={visibleUploadModal}
          />
        )}
        {/* `<figure><img src="${path}"/><figcaption>${desc}</figcaption></figure><p></p>` */}
      </>
    );
  }
);
