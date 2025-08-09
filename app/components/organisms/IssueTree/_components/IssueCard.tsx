import { FC } from "react";
import { Card } from "~/components/atoms/Card/Card";
import { Flex } from "~/components/atoms/Flex/Flex";
import { CheckCircleIcon } from "~/components/atoms/Icon/CheckCircle/CheckCircle";
import { QuestionMarkIcon } from "~/components/atoms/Icon/QuestionMark/QuestionMark";
import { Text } from "~/components/atoms/Text/Text";
import { Tooltip } from "~/components/atoms/Tooltip/Tooltip";
import { ActionIcon } from "~/components/atoms/ActionIcon/ActionIcon";

interface IssueCardProps {
  title: string;
  isResolved: boolean;
  onToggleResolved?: () => void;
}

const MAX_LETTER_LENGTH = 40;

export const IssueCard: FC<IssueCardProps> = ({ title, isResolved, onToggleResolved }) => {
  return (
    <Tooltip
      label={title}
      disabled={title.length < MAX_LETTER_LENGTH - 3}
      multiline
    >
      <Card
        withBorder
        w="max-content"
        maw={`${MAX_LETTER_LENGTH}em`}
        padding="sm"
      >
        <Flex gap={4} align="center">
          <Flex align="center">
            <ActionIcon
              size="sm"
              variant="subtle"
              color={isResolved ? "green" : "red"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleResolved?.();
              }}
              style={{ 
                cursor: onToggleResolved ? "pointer" : "default",
                transition: "transform 0.1s ease",
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              {isResolved ? (
                <CheckCircleIcon color="green" />
              ) : (
                <QuestionMarkIcon color="red" />
              )}
            </ActionIcon>
          </Flex>
          <Text lineClamp={1}>{title}</Text>
        </Flex>
      </Card>
    </Tooltip>
  );
};
