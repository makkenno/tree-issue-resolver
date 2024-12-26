import { TextInput } from "../../../molecules/TextInput/TextInput";
import { FieldApi, Validator } from "@tanstack/react-form";
import { FC } from "react";
import { z } from "zod";
import { IssueSchema } from "../IssueForm";

type TitleTextInputField = FieldApi<
  IssueSchema,
  "title",
  undefined,
  Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>,
  string
>;

interface TitleTextInputProps {
  field: TitleTextInputField;
}

export const TitleTextInput: FC<TitleTextInputProps> = ({ field }) => {
  return (
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
  );
};
