import { Button } from "@/components/atoms/Button/Button";
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
      <Button size="compact-xs" w="fit-content" onClick={clear}>
        リセット
      </Button>
    </Stack>
  );
};
