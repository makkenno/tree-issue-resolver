import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Box, Flex, TextInput } from "@mantine/core";
import { FieldApi } from "@tanstack/react-form";
import { TrashIcon } from "~/components/atoms/Icon/Trash/Trash";

interface SortableChildIssueItemProps {
  id: string;
  idField: any;
  titleField: any;
  onRemove: () => void;
}

export function SortableChildIssueItem({
  id,
  titleField,
  idField,
  onRemove,
}: SortableChildIssueItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes}>
      <input
        name={idField.name}
        value={idField.state.value || ""}
        onChange={(e) => idField.handleChange(e.target.value)}
        type="hidden"
      />
      <Flex align="center" gap="sm" flex={1}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          style={{ cursor: "grab" }}
          {...listeners}
        >
          ⋮⋮
        </ActionIcon>
        <TextInput
          name={titleField.name}
          value={titleField.state.value || ""}
          onChange={(e) => titleField.handleChange(e.target.value)}
          onBlur={titleField.handleBlur}
          error={
            titleField.state.meta.isTouched &&
            !titleField.state.meta.isValid ? (
              <em>{titleField.state.meta.errors.map((err: any) => typeof err === 'string' ? err : err?.message || String(err)).join(", ")}</em>
            ) : null
          }
          flex={1}
        />
        <ActionIcon variant="subtle" color="red" mt={4} onClick={onRemove}>
          <TrashIcon />
        </ActionIcon>
      </Flex>
    </Box>
  );
}
