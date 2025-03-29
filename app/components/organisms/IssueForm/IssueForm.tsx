import { Button } from "../../atoms/Button/Button";
import { Stack } from "../../atoms/Stack/Stack";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Fieldset } from "../../atoms/Fieldset/Fieldset";
import { TitleTextInput } from "./_components/TitleTextInput";
import { NoteTextarea } from "./_components/NoteTextarea";
import { IsResolvedCheckbox } from "./_components/IsResolvedCheckbox";
import { ChildIssueTextInput } from "./_components/ChildIssueTextInput";
import { FC } from "react";
import { TextInput } from "~/components/molecules/TextInput/TextInput";
import { Box } from "@mantine/core";

const title = z
  .string()
  .min(1, "この項目は必須です。")
  .max(140, "140文字以下で入力してください。");
const note = z.string().max(3000, "3000文字以下で入力してください。");

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
      <Stack gap="lg">
        <form.Field
          name="title"
          children={(field) => <TitleTextInput field={field} />}
        />
        <form.Field
          name="note"
          children={(field) => <NoteTextarea field={field} />}
        />
        <form.Field
          name="isResolved"
          children={(field) => <IsResolvedCheckbox field={field} />}
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
                          <ChildIssueTextInput
                            field={subField}
                            onClickRemoveIcon={() => field.removeValue(i)}
                          />
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
    </form>
  );
};
