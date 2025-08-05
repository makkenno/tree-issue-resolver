import { Button } from "../../atoms/Button/Button";
import { Stack } from "../../atoms/Stack/Stack";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Fieldset } from "../../atoms/Fieldset/Fieldset";
import { FC, useState } from "react";
import { TextInput } from "~/components/molecules/TextInput/TextInput";
import {
  ActionIcon,
  Box,
  Checkbox,
  Flex,
  Grid,
  Paper,
  Text,
} from "@mantine/core";
import { TrashIcon } from "~/components/atoms/Icon/Trash/Trash";
import { Textarea } from "../../molecules/Textarea/Textarea";
import { IconEye, IconEdit } from "@tabler/icons-react";
import { MarkdownRenderer } from "../../molecules/MarkdownRenderer/MarkdownRenderer";
import { zodValidator } from "@tanstack/zod-form-adapter";

const title = z
  .string()
  .min(1, "この項目は必須です。")
  .max(140, "140文字以下で入力してください。");
const note = z.string().max(30000, "30000文字以下で入力してください。");

const issueSchema = z.object({
  id: z.string().optional(),
  title,
  note,
  isResolved: z.boolean(),
  children: z.array(z.object({ id: z.string().min(1), title })),
});

export type IssueSchema = z.infer<typeof issueSchema>;

interface IssueFormProps {
  id?: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: { id: string; title: string }[];
  onSubmit: (value: IssueSchema) => Promise<void>;
}

export const IssueForm: FC<IssueFormProps> = ({
  id,
  title,
  note,
  isResolved,
  children,
  onSubmit,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const form = useForm({
    defaultValues: {
      id,
      title,
      note,
      isResolved,
      children,
    } as IssueSchema,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: issueSchema,
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
        form.state.isSubmitting = false;
      }}
    >
      <form.Field
        name="id"
        children={(field) => (
          <TextInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            type="hidden"
          />
        )}
      />
      <Grid align="flex-start" visibleFrom="md">
        <Grid.Col span={8}>
          <Stack gap="lg">
            <form.Field
              name="title"
              children={(field) => (
                <TextInput
                  id={field.name}
                  name={field.name}
                  label={"課題"}
                  error={
                    field.state.meta.errors.length ? (
                      <em>{field.state.meta.errors.join(",")}</em>
                    ) : null
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <form.Field
              name="isResolved"
              children={(field) => (
                <Checkbox
                  id={field.name}
                  name={field.name}
                  label="解決した"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  checked={field.state.value}
                />
              )}
            />
            <form.Field
              name="note"
              children={(field) => (
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
                        isPreviewMode ? (
                          <IconEdit size={16} />
                        ) : (
                          <IconEye size={16} />
                        )
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
              )}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col
          span={4}
          style={{
            width: "400px",
            position: "sticky",
            top: "20px",
          }}
        >
          <Stack gap="lg">
            <form.Field name="children" mode="array">
              {(field) => {
                return (
                  <Fieldset legend="関連する子課題" bg="initial">
                    <Stack>
                      {field.state.value.map((_, i) => (
                        <Box key={i}>
                          <form.Field name={`children[${i}].id`}>
                            {(subField) => (
                              <TextInput
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value}
                                type="hidden"
                              />
                            )}
                          </form.Field>
                          <form.Field name={`children[${i}].title`}>
                            {(subField) => (
                              <Flex align="flex-start" gap="sm" flex={1}>
                                <TextInput
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  error={
                                    subField.state.meta.errors.length ? (
                                      <em>
                                        {subField.state.meta.errors.join(",")}
                                      </em>
                                    ) : null
                                  }
                                  flex={1}
                                />
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  mt={4}
                                  onClick={() => field.removeValue(i)}
                                >
                                  <TrashIcon />
                                </ActionIcon>
                              </Flex>
                            )}
                          </form.Field>
                        </Box>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const id = crypto.randomUUID();
                          field.pushValue({ id, title: "" });
                        }}
                        type="button"
                      >
                        追加
                      </Button>
                    </Stack>
                  </Fieldset>
                );
              }}
            </form.Field>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "登録"}
                </Button>
              )}
            />
          </Stack>
        </Grid.Col>
      </Grid>
      <Box hiddenFrom="md">
        <Stack gap="lg">
          <form.Field
            name="title"
            children={(field) => (
              <TextInput
                id={field.name}
                name={field.name}
                label={"課題"}
                error={
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(",")}</em>
                  ) : null
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <form.Field
            name="isResolved"
            children={(field) => (
              <Checkbox
                id={field.name}
                name={field.name}
                label="解決した"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.checked)}
                checked={field.state.value}
              />
            )}
          />
          <form.Field
            name="note"
            children={(field) => (
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
                      isPreviewMode ? (
                        <IconEdit size={16} />
                      ) : (
                        <IconEye size={16} />
                      )
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
            )}
          />
          <form.Field name="children" mode="array">
            {(field) => {
              return (
                <Fieldset legend="関連する子課題" bg="initial">
                  <Stack>
                    {field.state.value.map((_, i) => (
                      <Box key={i}>
                        <form.Field name={`children[${i}].id`}>
                          {(subField) => (
                            <TextInput
                              id={subField.name}
                              name={subField.name}
                              value={subField.state.value}
                              type="hidden"
                            />
                          )}
                        </form.Field>
                        <form.Field name={`children[${i}].title`}>
                          {(subField) => (
                            <Flex align="flex-start" gap="sm" flex={1}>
                              <TextInput
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                onBlur={subField.handleBlur}
                                error={
                                  subField.state.meta.errors.length ? (
                                    <em>
                                      {subField.state.meta.errors.join(",")}
                                    </em>
                                  ) : null
                                }
                                flex={1}
                              />
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                mt={4}
                                onClick={() => field.removeValue(i)}
                              >
                                <TrashIcon />
                              </ActionIcon>
                            </Flex>
                          )}
                        </form.Field>
                      </Box>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const id = crypto.randomUUID();
                        field.pushValue({ id, title: "" });
                      }}
                      type="button"
                    >
                      追加
                    </Button>
                  </Stack>
                </Fieldset>
              );
            }}
          </form.Field>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "登録"}
              </Button>
            )}
          />
        </Stack>
      </Box>
    </form>
  );
};
