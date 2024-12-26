import { Title } from "~/components/atoms/Title/Title";
import { IssueForm } from "~/components/organisms/IssueForm/IssueForm";
import { IssueNodeType, useEditIssueNodeAtom } from "~/hooks/useIssueTreeAtom";
import { useNavigate } from "~/hooks/useNavigate";
import { FC } from "react";

interface EditIssueFormPageProps {
  nodeId: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: IssueNodeType[];
}

export const EditIssueFormPage: FC<EditIssueFormPageProps> = ({
  nodeId,
  title,
  note,
  isResolved,
  children,
}) => {
  const editIssueNode = useEditIssueNodeAtom();
  const navigate = useNavigate();

  return (
    <>
      <Title order={4} my="md">
        課題の編集
      </Title>
      <IssueForm
        title={title}
        note={note}
        isResolved={isResolved}
        children={children}
        onSubmit={(value) =>
          new Promise(() => {
            editIssueNode({ id: nodeId, ...value });
            navigate("/");
          })
        }
      />
    </>
  );
};
