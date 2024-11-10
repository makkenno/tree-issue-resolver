import { Button } from "@/components/atoms/Button/Button";
import { Stack } from "@/components/atoms/Stack/Stack";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Fieldset } from "@/components/atoms/Fieldset/Fieldset";
import { TitleTextInput } from "./_components/TitleTextInput";
import { NoteTextarea } from "./_components/NoteTextarea";
import { IsResolvedCheckbox } from "./_components/IsResolvedCheckbox";
import { ChildIssueTextInput } from "./_components/ChildIssueTextInput";
import { FC } from "react";

const title = z
  .string()
  .min(1, "この項目は必須です。")
  .max(140, "140文字以下で入力してください。");
const note = z.string().max(1000, "1000文字以下で入力してください。");

const issueSchema = z.object({
  title,
  note,
  isResolved: z.boolean(),
  children: z.array(z.object({ title })),
});

export type IssueSchema = z.infer<typeof issueSchema>;

interface IssueFormProps {
  title: string;
  note: string;
  isResolved: boolean;
  children: { title: string }[];
  onSubmit: (value: IssueSchema) => Promise<void>;
}

export const IssueForm: FC<IssueFormProps> = ({
  title,
  note,
  isResolved,
  children,
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: {
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
              <Fieldset legend="関連する子課題">
                <Stack>
                  {field.state.value.map((_, i) => {
                    return (
                      <form.Field key={i} name={`children[${i}].title`}>
                        {(subField) => (
                          <ChildIssueTextInput
                            field={subField}
                            onClickRemoveIcon={() => field.removeValue(i)}
                          />
                        )}
                      </form.Field>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={() => field.pushValue({ title: "" })}
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
