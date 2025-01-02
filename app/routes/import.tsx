import { Container } from "@mantine/core";
import { useState } from "react";
import { Button } from "~/components/atoms/Button/Button";
import { Stack } from "~/components/atoms/Stack/Stack";
import { Title } from "~/components/atoms/Title/Title";
import { Textarea } from "~/components/molecules/Textarea/Textarea";
import { useimportIssueAtom } from "~/hooks/useImportIssueAtom";
import { useNavigate } from "~/hooks/useNavigate";
import { issueTreeSchema } from "~/lib/zodSchema/issueTreeSchema";

export default function ImportPage() {
  const [jsonInput, setJsonInput] = useState("");
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
          const issueTree = issueTreeSchema.safeParse(JSON.parse(jsonInput));
          if (!issueTree.success) {
            alert("JSONの形式が正しくありません");
            return;
          }
          try {
            await importIssue(issueTree.data);
          } catch (e) {
            alert("インポートに失敗しました");
            return;
          }
          navigate(`/${issueTree.data.id}`);
        }}
      >
        <Stack>
          <Textarea
            value={jsonInput}
            autosize
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <Button type="submit">インポート</Button>
        </Stack>
      </form>
    </Container>
  );
}
