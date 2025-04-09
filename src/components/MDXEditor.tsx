import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  SandpackConfig,
  sandpackPlugin,
  ShowSandpackInfo,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import ImageUploadModal from "./ImageUploadModal";

const MDXEditorComponent = ({ editorKey, markdown, onChange }: any) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openImageModal = () => {
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
  };

  const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

  const simpleSandpackConfig: SandpackConfig = {
    defaultPreset: "react",
    presets: [
      {
        label: "React",
        name: "react",
        meta: "live react",
        sandpackTemplate: "react",
        sandpackTheme: "light",
        snippetFileName: "/App.js",
        snippetLanguage: "jsx",
        initialSnippetContent: defaultSnippetContent,
      },
    ],
  };

  return (
    <>
      <MDXEditor
        key={editorKey}
        markdown={markdown}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({
            disableImageSettingsButton: true,
          }),
          frontmatterPlugin(),
          tablePlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: "js",
          }),
          sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              jsx: "JavaScript JSX",
              ts: "TypeScript",
              tsx: "TypeScript JSX",
              html: "HTML",
              css: "CSS",
              php: "PHP",
              python: "Python",
              java: "Java",
              ruby: "Ruby",
              go: "Go",
              rust: "Rust",
              c: "C",
              cpp: "C++",
              csharp: "C#",
              json: "JSON",
              markdown: "Markdown",
              yaml: "YAML",
              bash: "Bash",
              plain: "Plain Text",
            },
          }),
          toolbarPlugin({
            toolbarClassName: "!top-[0px] z-50",
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CodeToggle />
                <CreateLink />
                <InsertTable />
                <InsertCodeBlock />

                <div className="hover:bg-[#e0e1e6] p-1 rounded-md">
                  <LuImagePlus
                    className="text-[20px] text-gray-400"
                    onClick={openImageModal}
                  />
                </div>

                <ImageUploadModal
                  isOpen={isModalOpen}
                  onClose={closeImageModal}
                />

                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      when: (editor) => editor?.editorType === "sandpack",
                      contents: () => <ShowSandpackInfo />,
                    },
                  ]}
                />
              </>
            ),
          }),
        ]}
      />
    </>
  );
};

export default MDXEditorComponent;
