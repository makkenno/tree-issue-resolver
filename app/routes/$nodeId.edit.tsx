import { Container } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { EditIssueFormPage } from "~/components/pages/Detail/EditIssueFormPage/EditIssueFormPage";

export default function RouteComponent() {
  const { nodeId } = useParams();
  if (!nodeId) throw new Error(`nodeId not found: ${nodeId}`);
  return (
    <Container>
      <EditIssueFormPage nodeId={nodeId} />
    </Container>
  );
}
