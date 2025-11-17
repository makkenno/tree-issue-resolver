import { FC } from "react";
import { Box, Paper, Text } from "@mantine/core";
import { Button } from "~/components/atoms/Button/Button";
import { TextInput } from "~/components/molecules/TextInput/TextInput";
import { CopyButton } from "~/components/atoms/CopyButton/CopyButton";
import { IconCopy } from "@tabler/icons-react";

interface TitleFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: React.ReactNode;
  isPreviewMode: boolean;
  isTouched: boolean;
  isValid: boolean;
}

export const TitleField: FC<TitleFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  isPreviewMode,
}) => {
  if (isPreviewMode) {
    return (
      <Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Text size="sm" fw={500}>
            課題
          </Text>
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
        </Box>
        <Paper withBorder p="sm">
          <Text>{value || ""}</Text>
        </Paper>
      </Box>
    );
  }

  return (
    <TextInput
      name={name}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      label="課題"
      error={error}
    />
  );
};
