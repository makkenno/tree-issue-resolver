import { Title } from "@/components/atoms/Title/Title";
import { IssueForm } from "@/components/organisms/IssueForm/IssueForm";
import {
  useCreateRootIssueAtom,
  useGetIssueTreeAtom,
} from "@/hooks/useIssueTreeAtom";

export const CreateIssueFormPage = () => {
  const issueTree = useGetIssueTreeAtom();
  const createRootIssue = useCreateRootIssueAtom();
  return (
    <>
      <Title order={4} my="md">
        課題の登録
      </Title>
      <IssueForm
        title={issueTree.title}
        note={issueTree.note}
        isResolved={issueTree.isResolved}
        children={issueTree.children}
        onSubmit={(value) =>
          new Promise(() => {
            createRootIssue(value);
          })
        }
      />
    </>
  );
};
