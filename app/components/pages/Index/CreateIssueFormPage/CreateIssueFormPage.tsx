import { Title } from "../../../atoms/Title/Title";
import { IssueForm } from "../../../organisms/IssueForm/IssueForm";
import { useCreateRootIssueAtom } from "../../../../hooks/useIssuesAtom";

export const CreateIssueFormPage = () => {
  const createRootIssue = useCreateRootIssueAtom();
  return (
    <>
      <Title order={4} my="md">
        課題の登録
      </Title>
      <IssueForm
        title={""}
        note={""}
        isResolved={false}
        children={[]}
        onSubmit={createRootIssue}
      />
    </>
  );
};
