import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Pre } from "../../pages/Editor/MarkdownOutputPage/Pre";
import { Code } from "../../pages/Editor/MarkdownOutputPage/Code";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: ({ children }) => (
          <h1
            style={{
              fontSize: "24px",
            }}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            style={{
              borderBottom: "1px solid #c9c9c9",
              fontSize: "22px",
              marginTop: "56px",
              marginBottom: "16px",
            }}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            style={{
              fontSize: "20px",
              marginTop: "32px",
              marginBottom: "16px",
            }}
          >
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4
            style={{
              fontSize: "18px",
              marginTop: "24px",
              marginBottom: "16px",
            }}
          >
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p style={{ marginBottom: "16px", fontSize: "16px" }}>{children}</p>
        ),
        ul: ({ children }) => (
          <ul
            style={{
              paddingInlineStart: "24px",
            }}
          >
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol
            style={{
              paddingInlineStart: "24px",
            }}
          >
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li
            style={{
              fontSize: "16px",
            }}
          >
            {children}
          </li>
        ),
        pre: Pre,
        code: Code,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
