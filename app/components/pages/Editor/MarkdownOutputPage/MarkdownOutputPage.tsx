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

export const MarkdownOutputPage: FC = () => {
  const markdown = useGenerateMarkdown();
  return (
    <>
      <Stack>
        <Box>
          <Markdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              h2: ({ children }) => (
                <h2
                  style={{
                    borderBottom: "1px solid #c9c9c9",
                    marginTop: "56px",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    marginTop: "32px",
                  }}
                >
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4
                  style={{
                    marginTop: "24px",
                  }}
                >
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p style={{ marginBottom: "1em" }}>{children}</p>
              ),
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
