import { useIssueNodeAtom } from "~/hooks/useIssueNodeAtom";
import { EditIssueFormPage } from "./EditIssueFormPage";
import { FC } from "react";

export const EditIssueFormPageContainer: FC = () => {
  const issueNode = useIssueNodeAtom();

  if (issueNode === undefined) return <div>見つかりませんでした</div>;

  return (
    <EditIssueFormPage
      nodeId={issueNode.id}
      title={issueNode.title}
      note={issueNode.note}
      isResolved={issueNode.isResolved}
      children={issueNode.children}
    />
  );
};
