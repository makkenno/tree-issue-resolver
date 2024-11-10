import { Title } from "@/components/atoms/Title/Title";
import { IssueForm } from "@/components/organisms/IssueForm/IssueForm";
import {
  useEditIssueNodeAtom,
  useGetIssueNodeWithChildrenAtom,
} from "@/hooks/useIssueTreeAtom";
import { useNavigate } from "@/hooks/useNavigate";
import { FC } from "react";

interface EditIssueFormPageProps {
  nodeId: string;
}

export const EditIssueFormPage: FC<EditIssueFormPageProps> = ({ nodeId }) => {
  const editIssueNode = useEditIssueNodeAtom();
  const issueTree = useGetIssueNodeWithChildrenAtom(nodeId);
  const navigate = useNavigate({ from: "/index/$nodeId/edit" });

  return (
    <>
      <Title order={4} my="md">
        課題の編集
      </Title>
      <IssueForm
        title={issueTree.title}
        note={issueTree.note}
        isResolved={issueTree.isResolved}
        children={issueTree.children}
        onSubmit={(value) =>
          new Promise(() => {
            editIssueNode({ id: nodeId, ...value });
            navigate({ to: "/" });
          })
        }
      />
    </>
  );
};
