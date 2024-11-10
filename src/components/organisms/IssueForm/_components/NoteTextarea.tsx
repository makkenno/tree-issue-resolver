import { FieldApi, Validator } from "@tanstack/react-form";
import { FC } from "react";
import { z } from "zod";
import { IssueSchema } from "../IssueForm";
import { Textarea } from "@/components/molecules/Textarea/Textarea";

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
  return (
    <Textarea
      id={field.name}
      name={field.name}
      label={"メモ"}
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
  );
};
