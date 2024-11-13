import { Stack } from "@/components/atoms/Stack/Stack";
import { Title } from "@/components/atoms/Title/Title";
import { Textarea } from "@/components/molecules/Textarea/Textarea";
import { useGetIssueTreeAtom } from "@/hooks/useIssueTreeAtom";
import { FC, useMemo } from "react";

export const MarkdownOutputPage: FC = () => {
  const markdown = useGenerateMarkdown();
  return (
    <>
      <Title order={4} my="md">
        出力
      </Title>
      <Stack>
        <Textarea value={markdown} autosize />
      </Stack>
    </>
  );
};

function useGenerateMarkdown(): string {
  const issueTree = useGetIssueTreeAtom();
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
