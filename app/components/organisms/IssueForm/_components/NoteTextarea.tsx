import { FieldApi, Validator } from "@tanstack/react-form";
import { FC, useState } from "react";
import { z } from "zod";
import { IssueSchema } from "../IssueForm";
import { Textarea } from "../../../molecules/Textarea/Textarea";
import { Button, Box, Paper, Text } from "@mantine/core";
import { IconEye, IconEdit } from "@tabler/icons-react";
import { MarkdownRenderer } from "../../../molecules/MarkdownRenderer/MarkdownRenderer";

type NoteTextareaField = FieldApi<
  IssueSchema,
  "note",
  undefined,
  Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>,
  string
>;

interface NoteTextareaProps {
  field: NoteTextareaField;
}

export const NoteTextarea: FC<NoteTextareaProps> = ({ field }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <Text size="sm" fw={500}>
          メモ
        </Text>
        <Button
          variant="subtle"
          size="compact-sm"
          onClick={togglePreview}
          leftSection={
            isPreviewMode ? <IconEdit size={16} /> : <IconEye size={16} />
          }
        >
          {isPreviewMode ? "編集" : "プレビュー"}
        </Button>
      </Box>

      {isPreviewMode ? (
        <Paper withBorder p="sm" style={{ minHeight: "100px" }}>
          {field.state.value ? (
            <MarkdownRenderer content={field.state.value} />
          ) : (
            <Text c="dimmed" fs="italic">
              プレビューするコンテンツがありません
            </Text>
          )}
        </Paper>
      ) : (
        <Textarea
          id={field.name}
          name={field.name}
          error={
            field.state.meta.errors.length ? (
              <em>{field.state.meta.errors.join(",")}</em>
            ) : null
          }
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          autosize
        />
      )}
    </Box>
  );
};
