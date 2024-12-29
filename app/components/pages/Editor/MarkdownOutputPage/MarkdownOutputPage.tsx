import { Flex } from "~/components/atoms/Flex/Flex";
import { Stack } from "../../../atoms/Stack/Stack";
import { Title } from "../../../atoms/Title/Title";
import { Textarea } from "../../../molecules/Textarea/Textarea";
import { FC, useMemo } from "react";
import { useIssueTreeAtom } from "~/hooks/useIssueRootAtom";
import { CopyButton } from "~/components/atoms/CopyButton/CopyButton";
import { Button } from "~/components/atoms/Button/Button";

export const MarkdownOutputPage: FC = () => {
  const markdown = useGenerateMarkdown();
  return (
    <>
      <Title order={4} my="md">
        出力
      </Title>
      <Stack>
        <Textarea value={markdown} autosize />
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
