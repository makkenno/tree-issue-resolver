import { CreateIssueFormPage } from "../components/pages/Index/CreateIssueFormPage/CreateIssueFormPage";
import { Container } from "@mantine/core";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "issue-tree" }, { name: "description", content: "" }];
};

export default function HomeComponent() {
  return (
    <Container>
      <CreateIssueFormPage />
    </Container>
  );
}
