import { Container, Text } from "@mantine/core";
import { useState } from "react";
import { Button } from "~/components/atoms/Button/Button";
import { Stack } from "~/components/atoms/Stack/Stack";
import { Title } from "~/components/atoms/Title/Title";
import { Textarea } from "~/components/molecules/Textarea/Textarea";
import { useimportIssueAtom } from "~/hooks/useImportIssueAtom";
import { useNavigate } from "~/hooks/useNavigate";
import {
  parseSimpleFormat,
  convertToIssueNode,
} from "~/lib/parser/simpleFormatParser";

export default function ImportPage() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const importIssue = useimportIssueAtom();

  return (
    <Container>
      <Title order={4} my="md">
        インポート
      </Title>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const simpleNode = parseSimpleFormat(input);
          if (!simpleNode) {
            alert("テキストの形式が正しくありません");
            return;
          }

          const issueTreeData = convertToIssueNode(simpleNode);

          try {
            await importIssue(issueTreeData);
          } catch (e) {
            alert("インポートに失敗しました");
            return;
          }
          navigate(`/${issueTreeData.id}`);
        }}
      >
        <Stack>
          <div>
            <Text size="sm" fw={500} mb="xs">
              課題ツリー
            </Text>
            <Text size="xs" c="dimmed" mb="xs">
              例: # タイトル → ## 子タイトル → ### 孫タイトル
              <br />
              メモは行頭に &gt; を付けて記述
            </Text>
            <Textarea
              value={input}
              autosize
              minRows={8}
              placeholder="# メインタスク\n> これはメモです\n\n## サブタスク1\n\n### 詳細タスク"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button type="submit">インポート</Button>
        </Stack>
      </form>
    </Container>
  );
}
