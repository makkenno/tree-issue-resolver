import { Container } from "@mantine/core";
import { MarkdownOutputPage } from "../components/pages/Editor/MarkdownOutputPage/MarkdownOutputPage";
import { Suspense, useEffect } from "react";
import { useSetIssueTreeIdAtom } from "~/hooks/useIssueRootAtom";
import { useParams } from "@remix-run/react";
import { LoadingOverlay } from "~/components/molecules/LoadingOverlay/LoadingOverlay";

export default function OutputComponent() {
  const { treeId } = useParams();

  if (!treeId) throw new Error(`treeId not found`);

  const setIssueTreeId = useSetIssueTreeIdAtom();

  useEffect(() => {
    setIssueTreeId(treeId);
  }, [treeId]);

  return (
    <Container>
      <Suspense fallback={<LoadingOverlay />}>
        <MarkdownOutputPage />
      </Suspense>
    </Container>
  );
}
