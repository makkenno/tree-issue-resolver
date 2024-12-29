import { Title } from "~/components/atoms/Title/Title";
import { IssueForm } from "~/components/organisms/IssueForm/IssueForm";
import { useNavigate } from "~/hooks/useNavigate";
import { FC } from "react";
import { useParams } from "@remix-run/react";
import { useUpdateIssueNodeAtom } from "~/hooks/useUpdateIssueNodeAtom";
import { IssueNodeType } from "~/hooks/useIssueRootAtom";

export interface EditIssueFormPageProps {
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
  const { treeId } = useParams();
  const updateIssueNode = useUpdateIssueNodeAtom();
  const navigate = useNavigate();

  return (
    <>
      <Title order={4} my="md">
        課題の編集
      </Title>
      <IssueForm
        id={nodeId}
        title={title}
        note={note}
        isResolved={isResolved}
        children={children}
        onSubmit={async (value) => {
          await updateIssueNode({ id: nodeId, ...value });
          navigate(`/${treeId}`);
        }}
      />
    </>
  );
};
