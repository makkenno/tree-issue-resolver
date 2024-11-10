import { Button } from "@/components/atoms/Button/Button";
import { CopyButton } from "@/components/atoms/CopyButton/CopyButton";
import { Flex } from "@/components/atoms/Flex/Flex";
import { Stack } from "@/components/atoms/Stack/Stack";
import { IssueTree } from "@/components/organisms/IssueTree/IssueTree";
import {
  useClearIssueTreeAtom,
  useGetIssueTreeAtom,
} from "@/hooks/useIssueTreeAtom";

export const DisplayIssueTreePage = () => {
  const issueTree = useGetIssueTreeAtom();
  const clear = useClearIssueTreeAtom();
  return (
    <Stack mt="md">
      <IssueTree tree={issueTree} />
      <Flex gap="xs">
        <Button size="compact-xs" w="fit-content" onClick={clear}>
          リセット
        </Button>
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
