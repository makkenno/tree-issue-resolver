import { FC } from "react";
import { Box, Paper, Text } from "@mantine/core";
import { Button } from "~/components/atoms/Button/Button";
import { Textarea } from "~/components/molecules/Textarea/Textarea";
import { CopyButton } from "~/components/atoms/CopyButton/CopyButton";
import { MarkdownRenderer } from "~/components/molecules/MarkdownRenderer/MarkdownRenderer";
import { IconEye, IconEdit, IconCopy } from "@tabler/icons-react";

interface NoteFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: React.ReactNode;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

export const NoteField: FC<NoteFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  isPreviewMode,
  onTogglePreview,
}) => {
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
          onClick={onTogglePreview}
          leftSection={
            isPreviewMode ? <IconEdit size={16} /> : <IconEye size={16} />
          }
        >
          {isPreviewMode ? "編集" : "プレビュー"}
        </Button>
        {isPreviewMode && (
          <CopyButton value={value || ""}>
            {({ copied, copy }) => (
              <Button
                variant="subtle"
                size="compact-sm"
                onClick={copy}
                leftSection={<IconCopy size={16} />}
                color={copied ? "teal" : undefined}
              >
                {copied ? "コピーした" : "コピー"}
              </Button>
            )}
          </CopyButton>
        )}
      </Box>

      {isPreviewMode ? (
        <Paper withBorder p="sm" style={{ minHeight: "100px" }}>
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <Text c="dimmed" fs="italic">
              プレビューするコンテンツがありません
            </Text>
          )}
        </Paper>
      ) : (
        <Textarea
          name={name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          error={error}
          autosize
        />
      )}
    </Box>
  );
};
