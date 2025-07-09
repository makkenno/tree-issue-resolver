import { Container, LoadingOverlay } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { Suspense, useEffect } from "react";
import { EditIssueFormPageContainer } from "~/components/pages/Detail/EditIssueFormPage/EditIssueFormPageContainer";
import { useSetIssueNodeIdAtom } from "~/hooks/useIssueNodeAtom";

export default function RouteComponent() {
  const { nodeId } = useParams();

  if (!nodeId) throw new Error(`nodeId not found`);

  const setIssueNodeId = useSetIssueNodeIdAtom();

  useEffect(() => {
    setIssueNodeId(nodeId);
  }, [nodeId]);

  return (
    <Container size="100%" p={16}>
      <Suspense fallback={<LoadingOverlay />}>
        <EditIssueFormPageContainer />
      </Suspense>
    </Container>
  );
}
