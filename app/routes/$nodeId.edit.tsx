import { Container } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { EditIssueFormPage } from "~/components/pages/Detail/EditIssueFormPage/EditIssueFormPage";
import { useGetIssueNodeWithChildrenAtom } from "~/hooks/useIssueTreeAtom";

export default function RouteComponent() {
  const { nodeId } = useParams();
  if (!nodeId) throw new Error(`nodeId not found: ${nodeId}`);
  const issueTree = useGetIssueNodeWithChildrenAtom(nodeId);

  return (
    <Container>
      <EditIssueFormPage
        nodeId={nodeId}
        title={issueTree.title}
        note={issueTree.note}
        isResolved={issueTree.isResolved}
        children={issueTree.children}
      />
    </Container>
  );
}
