import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoMdCheckmark, IoMdCopy } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "utils/slug";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
// Interface for heading structure
interface Heading {
  id: string;
  text: string;
  level: number;
}

const getPlainTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((child) => getPlainTextFromChildren(child)).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    return getPlainTextFromChildren(children.props.children);
  }

  return "";
};

const removeMarkdownFormatting = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold **text**
    .replace(/__(.*?)__/g, "$1") // Bold __text__
    .replace(/\*(.*?)\*/g, "$1") // Italic *text*
    .replace(/_(.*?)_/g, "$1") // Italic _text_
    .replace(/`(.*?)`/g, "$1") // Code `text`
    .trim();
};

const generateIdFromCode = (codeString: string) => {
  return btoa(unescape(encodeURIComponent(codeString))); // Mã hóa base64 rồi cắt lấy 10 ký tự đầu
};

// Updated MarkdownRenderer with heading extraction
const MarkdownRenderer = ({
  content,
  onHeadingsExtracted,
}: {
  content?: string;
  onHeadingsExtracted?: (headings: Heading[]) => void;
}) => {
  const [SyntaxHighlighter, setSyntaxHighlighter] = useState<any>(null);
  const [generatedIds, setGeneratedIds] = useState<Record<string, string>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    import("react-syntax-highlighter").then((mod) => {
      setSyntaxHighlighter(() => mod.Prism);
    });
  }, []);

  // Extract headings from markdown on component mount

  useEffect(() => {
    if (content && onHeadingsExtracted) {
      const headings: Heading[] = [];
      // Match heading patterns in markdown (## Heading)
      const regex = /^(#{1,6})\s+(.+)$/gm;
      let matches;

      // Create mapping of ids
      const newGeneratedIds: Record<string, string> = {};

      while ((matches = regex.exec(content)) !== null) {
        const level = matches[1].length;
        // Only capture h2 and h3 headings
        if (level === 2 || level === 3) {
          const rawText = matches[2].trim();
          const text = removeMarkdownFormatting(rawText);

          // Create a consistent ID based on the text content
          const id = slugify(text);
          newGeneratedIds[text] = id;

          headings.push({
            id,
            text,
            level: level,
          });
        }
      }

      setGeneratedIds(newGeneratedIds);
      onHeadingsExtracted(headings);
    }
  }, [content]);

  const handleCopy = (blockId: string) => {
    setCopiedStates(() => ({ [blockId]: true }));
  };

  if (!SyntaxHighlighter) return <div>Đang tải...</div>;

  return (
    <div className="mx-auto md:p-6 rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => {
            // Extract plain text from potentially complex children structure
            const plainText = getPlainTextFromChildren(children);

            // Use our generated ID from the extraction phase
            const id = generatedIds[plainText] || slugify(plainText);

            return (
              <h1
                id={id}
                {...props}
                className="text-3xl font-bold my-4 pt-4  transition-colors duration-500"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            // Extract plain text from potentially complex children structure
            const plainText = getPlainTextFromChildren(children);

            // Use our generated ID from the extraction phase
            const id = generatedIds[plainText] || slugify(plainText);

            return (
              <h2
                id={id}
                {...props}
                className="text-2xl font-bold my-4 pt-4 transition-colors duration-500"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            // Extract plain text from potentially complex children structure
            const plainText = getPlainTextFromChildren(children);

            const id = generatedIds[plainText] || slugify(plainText);

            return (
              <h3
                id={id}
                {...props}
                className="text-xl font-bold my-4 pt-4 transition-colors duration-500"
              >
                {children}
              </h3>
            );
          },
          blockquote: ({ children, ...props }) => {
            return (
              <blockquote
                {...props}
                className="border-l-[4px] md:border-l-[6px] border-purple-500 px-4 py-3  bg-gray-100 dark:bg-[#222] italic text-base md:text-lg font-semibold my-6 rounded-md"
              >
                <div className="blockquote-content [&>p]:mb-0">{children}</div>
              </blockquote>
            );
          },

          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const id = generateIdFromCode(codeString);

            return match ? (
              <div className="relative">
                <SyntaxHighlighter
                  wrapLongLines
                  showLineNumbers
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !pt-10 custom-scrollbar md:!text-xs !text-[10px]"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>

                <div className="">
                  <span className="absolute top-1 left-1 bg-white dark:bg-[#222] px-2 rounded-md">
                    {match[1]}
                  </span>
                  {
                    //@ts-ignore
                    <CopyToClipboard
                      text={codeString}
                      onCopy={() => handleCopy(id)}
                    >
                      <button className="absolute top-2 right-2  p-1 bg-gray-800 text-white rounded-full hover:bg-purple-600">
                        {copiedStates[id] ? (
                          <IoMdCheckmark className="text-lg text-green-400" />
                        ) : (
                          <IoMdCopy className="text-lg" />
                        )}
                      </button>
                    </CopyToClipboard>
                  }
                </div>
              </div>
            ) : (
              <code
                className="bg-gray-800 text-pink-400 px-1 rounded"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-4 leading-[1.8]">{children}</p>;
          },
          ul({ children }) {
            return <ul className="leading-[1.8] list-disc pl-5">{children}</ul>;
          },
          img({ children, ...props }) {
            return (
              <img className="mx-auto" {...props}>
                {children}
              </img>
            );
          },
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith("http");

            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300 block"
                {...props}
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-left">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
            );
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return (
              <tr className="border-t border-gray-300 dark:border-gray-700">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
