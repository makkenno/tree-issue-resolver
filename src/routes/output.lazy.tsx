import { createLazyFileRoute } from "@tanstack/react-router";
import { Container } from "@mantine/core";
import { MarkdownOutputPage } from "@/components/pages/Editor/MarkdownOutputPage/MarkdownOutputPage";

export const Route = createLazyFileRoute("/output")({
  component: OutputComponent,
});

function OutputComponent() {
  return (
    <Container>
      <MarkdownOutputPage />
    </Container>
  );
}
