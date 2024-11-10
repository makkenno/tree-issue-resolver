import { TrashIcon } from "@/components/atoms/Icon/Trash/Trash";
import { TextInput } from "@/components/molecules/TextInput/TextInput";
import { FieldApi, Validator } from "@tanstack/react-form";
import { FC } from "react";
import { z } from "zod";
import { IssueSchema } from "../IssueForm";
import { Flex, ActionIcon } from "@mantine/core";

type ChildIssueTextInputField = FieldApi<
  IssueSchema,
  `children[${number}].title`,
  undefined,
  Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>,
  string
>;

interface ChildIssueTextInputProps {
  field: ChildIssueTextInputField;
  onClickRemoveIcon: () => void;
}

export const ChildIssueTextInput: FC<ChildIssueTextInputProps> = ({
  field,
  onClickRemoveIcon,
}) => {
  return (
    <Flex align="flex-start" gap="sm" flex={1}>
      <TextInput
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        error={
          field.state.meta.errors.length ? (
            <em>{field.state.meta.errors.join(",")}</em>
          ) : null
        }
        flex={1}
      />
      <ActionIcon
        variant="subtle"
        color="red"
        mt={4}
        onClick={onClickRemoveIcon}
      >
        <TrashIcon />
      </ActionIcon>
    </Flex>
  );
};
