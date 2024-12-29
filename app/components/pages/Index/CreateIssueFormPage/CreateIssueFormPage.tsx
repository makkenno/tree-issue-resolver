import { Title } from "../../../atoms/Title/Title";
import { IssueForm } from "../../../organisms/IssueForm/IssueForm";
import { useCreateRootIssueAtom } from "../../../../hooks/useIssuesAtom";
import { useNavigate } from "~/hooks/useNavigate";

export const CreateIssueFormPage = () => {
  const createRootIssue = useCreateRootIssueAtom();
  const navigate = useNavigate();
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
        onSubmit={async (value) => {
          const id = crypto.randomUUID();
          await createRootIssue({ ...value, id });
          navigate(`/${id}`);
        }}
      />
    </>
  );
};
