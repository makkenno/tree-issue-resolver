import { Container } from "@mantine/core";
import { DisplayIssueTreePageContainer } from "../components/pages/Index/DisplayIssueTreePage/DisplayIssueTreePage";
import { useParams } from "@remix-run/react";
import { useSetIssueTreeIdAtom } from "~/hooks/useIssueRootAtom";
import { Suspense, useEffect } from "react";
import { LoadingOverlay } from "~/components/molecules/LoadingOverlay/LoadingOverlay";

export default function $TreeIdComponent() {
  const { treeId } = useParams();

  if (!treeId) throw new Error(`treeId not found`);

  const setIssueTreeId = useSetIssueTreeIdAtom();

  useEffect(() => {
    setIssueTreeId(treeId);
  }, [treeId]);

  return (
    <Container>
      <Suspense fallback={<LoadingOverlay />}>
        <DisplayIssueTreePageContainer />
      </Suspense>
    </Container>
  );
}
