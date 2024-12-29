import { Button } from "../../../atoms/Button/Button";
import { CopyButton } from "../../../atoms/CopyButton/CopyButton";
import { Flex } from "../../../atoms/Flex/Flex";
import { Stack } from "../../../atoms/Stack/Stack";
import { IssueTree } from "../../../organisms/IssueTree/IssueTree";
import { useIssueTreeAtom } from "~/hooks/useIssueRootAtom";

export const DisplayIssueTreePageContainer = () => {
  const issueTree = useIssueTreeAtom();

  if (!issueTree) return <div>not found</div>;

  return (
    <Stack mt="md">
      <IssueTree tree={issueTree} />
      <Flex gap="xs">
        <CopyButton value={JSON.stringify(issueTree)}>
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
  );
};
