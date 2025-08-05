import { Button } from "../../atoms/Button/Button";
import { Stack } from "../../atoms/Stack/Stack";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Fieldset } from "../../atoms/Fieldset/Fieldset";
import { FC, useState } from "react";
import { TextInput } from "~/components/molecules/TextInput/TextInput";
import { Box, Checkbox, Grid, Paper, Text } from "@mantine/core";
import { Textarea } from "../../molecules/Textarea/Textarea";
import { IconEye, IconEdit } from "@tabler/icons-react";
import { MarkdownRenderer } from "../../molecules/MarkdownRenderer/MarkdownRenderer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableChildIssueItem } from "./SortableChildIssueItem";

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
            value={field.state.value || ""}
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
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  label="課題"
                  error={
                    field.state.meta.isTouched && !field.state.meta.isValid ? (
                      <em>{field.state.meta.errors.map((err: any) => typeof err === 'string' ? err : err?.message || String(err)).join(", ")}</em>
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
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={
                        field.state.meta.isTouched &&
                        !field.state.meta.isValid ? (
                          <em>{field.state.meta.errors.map((err: any) => typeof err === 'string' ? err : err?.message || String(err)).join(", ")}</em>
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
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => {
                        const { active, over } = event;

                        if (active.id !== over?.id) {
                          const oldIndex =
                            field.state.value?.findIndex(
                              (item: any) => item.id === active.id
                            ) ?? -1;
                          const newIndex =
                            field.state.value?.findIndex(
                              (item: any) => item.id === over?.id
                            ) ?? -1;

                          if (oldIndex !== -1 && newIndex !== -1) {
                            const newItems = arrayMove(
                              field.state.value || [],
                              oldIndex,
                              newIndex
                            );
                            field.handleChange(newItems);
                          }
                        }
                      }}
                    >
                      <SortableContext
                        items={
                          field.state.value?.map((item: any) => item.id) || []
                        }
                        strategy={verticalListSortingStrategy}
                      >
                        <Stack>
                          {field.state.value?.map((item: any, i: number) => (
                            <form.Field
                              key={item.id}
                              name={`children[${i}].id`}
                            >
                              {(idField) => (
                                <form.Field name={`children[${i}].title`}>
                                  {(titleField) => (
                                    <SortableChildIssueItem
                                      id={item.id}
                                      key={item.id}
                                      titleField={titleField}
                                      idField={idField}
                                      onRemove={() => field.removeValue(i)}
                                    />
                                  )}
                                </form.Field>
                              )}
                            </form.Field>
                          ))}
                        </Stack>
                      </SortableContext>
                    </DndContext>
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
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                label="課題"
                error={
                  field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.map((err: any) => typeof err === 'string' ? err : err?.message || String(err)).join(", ")}</em>
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
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched &&
                      !field.state.meta.isValid ? (
                        <em>{field.state.meta.errors.map((err: any) => typeof err === 'string' ? err : err?.message || String(err)).join(", ")}</em>
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => {
                      const { active, over } = event;

                      if (active.id !== over?.id) {
                        const oldIndex =
                          field.state.value?.findIndex(
                            (item: any) => item.id === active.id
                          ) ?? -1;
                        const newIndex =
                          field.state.value?.findIndex(
                            (item: any) => item.id === over?.id
                          ) ?? -1;

                        if (oldIndex !== -1 && newIndex !== -1) {
                          const newItems = arrayMove(
                            field.state.value || [],
                            oldIndex,
                            newIndex
                          );
                          field.handleChange(newItems);
                        }
                      }
                    }}
                  >
                    <SortableContext
                      items={
                        field.state.value?.map((item: any) => item.id) || []
                      }
                      strategy={verticalListSortingStrategy}
                    >
                      <Stack>
                        {field.state.value?.map((item: any, i: number) => (
                          <form.Field key={item.id} name={`children[${i}].id`}>
                            {(idField) => (
                              <form.Field name={`children[${i}].title`}>
                                {(titleField) => (
                                  <SortableChildIssueItem
                                    key={item.id}
                                    id={item.id}
                                    titleField={titleField}
                                    idField={idField}
                                    onRemove={() => field.removeValue(i)}
                                  />
                                )}
                              </form.Field>
                            )}
                          </form.Field>
                        ))}
                      </Stack>
                    </SortableContext>
                  </DndContext>
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
