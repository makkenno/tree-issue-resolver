import { CreateIssueFormPage } from "../components/pages/Index/CreateIssueFormPage/CreateIssueFormPage";
import { Container } from "@mantine/core";
import { useGetIssueTreeAtom } from "../hooks/useIssueTreeAtom";
import { DisplayIssueTreePage } from "../components/pages/Index/DisplayIssueTreePage/DisplayIssueTreePage";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "issue-tree" }, { name: "description", content: "" }];
};

export default function HomeComponent() {
  const issueTree = useGetIssueTreeAtom();
  return (
    <Container>
      {issueTree.id === "" ? <CreateIssueFormPage /> : <DisplayIssueTreePage />}
    </Container>
  );
}
