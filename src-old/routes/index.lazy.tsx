import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CreateIssueFormPage } from "../components/pages/Index/CreateIssueFormPage/CreateIssueFormPage";
import { Container } from "@mantine/core";
import { useGetIssueTreeAtom } from "../hooks/useIssueTreeAtom";
import { DisplayIssueTreePage } from "../components/pages/Index/DisplayIssueTreePage/DisplayIssueTreePage";

export const Route = createLazyFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const issueTree = useGetIssueTreeAtom();
  return (
    <Container>
      {issueTree.id === "" ? <CreateIssueFormPage /> : <DisplayIssueTreePage />}
    </Container>
  );
}
