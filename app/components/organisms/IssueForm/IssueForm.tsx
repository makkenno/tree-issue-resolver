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
      }}
    >
      <form.Field name="id">
        {(field) => (
          <input
            name={field.name}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
            type="hidden"
          />
        )}
      </form.Field>
      <Grid align="flex-start" visibleFrom="md">
        <Grid.Col span={8}>
          <Stack gap="lg">
            <form.Field name="title">
              {(field) => (
                <TextInput
                  name={field.name}
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  label="課題"
                  error={
                    field.state.meta.isTouched && !field.state.meta.isValid ? (
                      <em>{field.state.meta.errors.join(', ')}</em>
                    ) : null
                  }
                />
              )}
            </form.Field>
            <form.Field
              name="isResolved"
            >
              {(field) => (
                <Checkbox
                  name={field.name}
                  label="解決した"
                  checked={field.state.value || false}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="note">
              {(field) => (
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
                      name={field.name}
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={
                        field.state.meta.isTouched && !field.state.meta.isValid ? (
                          <em>{field.state.meta.errors.join(', ')}</em>
                        ) : null
                      }
                      autosize
                    />
                  )}
                </Box>
              )}
            </form.Field>
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
            <Fieldset legend="関連する子課題" bg="initial">
              <form.Field name="children" mode="array">
                {(field) => (
                  <Stack>
                    {field.state.value?.map((_, i) => (
                      <Box key={i}>
                        <form.Field name={`children[${i}].id`}>
                          {(idField) => (
                            <input
                              name={idField.name}
                              value={idField.state.value || ''}
                              onChange={(e) => idField.handleChange(e.target.value)}
                              type="hidden"
                            />
                          )}
                        </form.Field>
                        <Flex align="flex-start" gap="sm" flex={1}>
                          <form.Field name={`children[${i}].title`}>
                            {(titleField) => (
                              <TextInput
                                name={titleField.name}
                                value={titleField.state.value || ''}
                                onChange={(e) => titleField.handleChange(e.target.value)}
                                onBlur={titleField.handleBlur}
                                error={
                                  titleField.state.meta.isTouched && !titleField.state.meta.isValid ? (
                                    <em>{titleField.state.meta.errors.join(', ')}</em>
                                  ) : null
                                }
                                flex={1}
                              />
                            )}
                          </form.Field>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            mt={4}
                            onClick={() => field.removeValue(i)}
                          >
                            <TrashIcon />
                          </ActionIcon>
                        </Flex>
                      </Box>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const id = crypto.randomUUID();
                        field.pushValue({ id, title: '' });
                      }}
                      type="button"
                    >
                      追加
                    </Button>
                  </Stack>
                )}
              </form.Field>
            </Fieldset>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "..." : "登録"}
                </Button>
              )}
            </form.Subscribe>
          </Stack>
        </Grid.Col>
      </Grid>
      <Box hiddenFrom="md">
        <Stack gap="lg">
          <form.Field name="title">
            {(field) => (
              <TextInput
                name={field.name}
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                label="課題"
                error={
                  field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.join(', ')}</em>
                  ) : null
                }
              />
            )}
          </form.Field>
          <form.Field name="isResolved">
            {(field) => (
              <Checkbox
                name={field.name}
                label="解決した"
                checked={field.state.value || false}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
          <form.Field name="note">
            {(field) => (
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
                    name={field.name}
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched && !field.state.meta.isValid ? (
                        <em>{field.state.meta.errors.join(', ')}</em>
                      ) : null
                    }
                    autosize
                  />
                )}
              </Box>
            )}
          </form.Field>
          <Fieldset legend="関連する子課題" bg="initial">
            <form.Field name="children" mode="array">
              {(field) => (
                <Stack>
                  {field.state.value?.map((_, i) => (
                    <Box key={i}>
                      <form.Field name={`children[${i}].id`}>
                        {(idField) => (
                          <input
                            name={idField.name}
                            value={idField.state.value || ''}
                            onChange={(e) => idField.handleChange(e.target.value)}
                            type="hidden"
                          />
                        )}
                      </form.Field>
                      <Flex align="flex-start" gap="sm" flex={1}>
                        <form.Field name={`children[${i}].title`}>
                          {(titleField) => (
                            <TextInput
                              name={titleField.name}
                              value={titleField.state.value || ''}
                              onChange={(e) => titleField.handleChange(e.target.value)}
                              onBlur={titleField.handleBlur}
                              error={
                                titleField.state.meta.isTouched && !titleField.state.meta.isValid ? (
                                  <em>{titleField.state.meta.errors.join(', ')}</em>
                                ) : null
                              }
                              flex={1}
                            />
                          )}
                        </form.Field>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          mt={4}
                          onClick={() => field.removeValue(i)}
                        >
                          <TrashIcon />
                        </ActionIcon>
                      </Flex>
                    </Box>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const id = crypto.randomUUID();
                      field.pushValue({ id, title: '' });
                    }}
                    type="button"
                  >
                    追加
                  </Button>
                </Stack>
              )}
            </form.Field>
          </Fieldset>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "..." : "登録"}
              </Button>
            )}
          </form.Subscribe>
        </Stack>
      </Box>
    </form>
  );
};
