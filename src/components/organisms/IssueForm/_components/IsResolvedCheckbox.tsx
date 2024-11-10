import { FieldApi, Validator } from "@tanstack/react-form";
import { FC } from "react";
import { z } from "zod";
import { IssueSchema } from "../IssueForm";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

type IsResolvedCheckboxField = FieldApi<
  IssueSchema,
  "isResolved",
  undefined,
  Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>,
  boolean
>;

interface IsResolvedCheckboxProps {
  field: IsResolvedCheckboxField;
}

export const IsResolvedCheckbox: FC<IsResolvedCheckboxProps> = ({ field }) => {
  return (
    <Checkbox
      id={field.name}
      name={field.name}
      label="解決した"
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.checked)}
      checked={field.state.value}
    />
  );
};
