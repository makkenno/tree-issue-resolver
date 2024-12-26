import { Stack } from "../../../atoms/Stack/Stack";
import { Title } from "../../../atoms/Title/Title";
import { Textarea } from "../../../molecules/Textarea/Textarea";
import { useImportIssueTreeAtom } from "../../../../hooks/useIssueTreeAtom";
import { useNavigate } from "../../../../hooks/useNavigate";
import { Button } from "@mantine/core";
import { FC, useState } from "react";

export const JsonImportPage: FC = () => {
  const [jsonInput, setJsonInput] = useState("");
  const importIssue = useImportIssueTreeAtom();
  const navigate = useNavigate({ from: "/import" });
  return (
    <>
      <Title order={4} my="md">
        インポート
      </Title>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          importIssue(jsonInput);
          navigate({ to: "/" });
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
    </>
  );
};
