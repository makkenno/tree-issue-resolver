import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { EditIssueFormPage } from "@/components/pages/Detail/EditIssueFormPage/EditIssueFormPage";
import { Container } from "@mantine/core";

export const Route = createLazyFileRoute("/index/$nodeId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { nodeId } = Route.useParams();
  return (
    <Container>
      <EditIssueFormPage nodeId={nodeId} />
    </Container>
  );
}
