import { Flex } from "~/components/atoms/Flex/Flex";
import { Stack } from "../../../atoms/Stack/Stack";
import { Box } from "~/components/atoms/Box/Box";
import { FC, useMemo } from "react";
import { useIssueTreeAtom } from "~/hooks/useIssueRootAtom";
import { CopyButton } from "~/components/atoms/CopyButton/CopyButton";
import { Button } from "~/components/atoms/Button/Button";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Pre } from "./Pre";
import { Code } from "./Code";

export const MarkdownOutputPage: FC = () => {
  const markdown = useGenerateMarkdown();
  return (
    <>
      <Stack>
        <Box>
          <Markdown
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
                <p style={{ marginBottom: "16px", fontSize: "16px" }}>
                  {children}
                </p>
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
            {markdown}
          </Markdown>
        </Box>
        <Flex gap="xs">
          <CopyButton value={markdown}>
            {({ copied, copy }) => (
              <Button
                size="compact-xs"
                w="fit-content"
                variant="outline"
                color={copied ? "teal" : "blue"}
                onClick={copy}
              >
                {copied ? "コピーした" : "コピー"}
              </Button>
            )}
          </CopyButton>
        </Flex>
      </Stack>
    </>
  );
};

function useGenerateMarkdown(): string {
  const issueTree = useIssueTreeAtom();
  if (!issueTree) return "";
  return useMemo(() => generateMarkdown(issueTree), [issueTree]);
}

interface Node {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: Node[];
}

function generateMarkdown(node: Node, depth: number = 1): string {
  const headerPrefix = "#".repeat(depth);
  let markdown =
    node.note.length !== 0
      ? `${headerPrefix} ${node.title}\n\n${node.note}\n\n`
      : `${headerPrefix} ${node.title}\n\n`;

  for (const child of node.children) {
    markdown += generateMarkdown(child, depth + 1);
  }

  return markdown;
}
