import { createLazyFileRoute } from "@tanstack/react-router";
import { Container } from "@mantine/core";
import { JsonImportPage } from "@/components/pages/Editor/JSONInputPage/JSONInputPage";

export const Route = createLazyFileRoute("/import")({
  component: ImportComponent,
});

function ImportComponent() {
  return (
    <Container>
      <JsonImportPage />
    </Container>
  );
}
