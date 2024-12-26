import { Box } from "../../atoms/Box/Box";
import { Card } from "../../atoms/Card/Card";
import { Flex } from "../../atoms/Flex/Flex";
import { CheckCircleIcon } from "../../atoms/Icon/CheckCircle/CheckCircle";
import { QuestionMarkIcon } from "../../atoms/Icon/QuestionMark/QuestionMark";
import { Text } from "../../atoms/Text/Text";
import { Tooltip } from "../../atoms/Tooltip/Tooltip";
import { FC } from "react";

interface IssueCardProps {
  title: string;
  isResolved: boolean;
}

const MAX_LETTER_LENGTH = 40;

export const IssueCard: FC<IssueCardProps> = ({ title, isResolved }) => {
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
            {isResolved ? (
              <CheckCircleIcon color="green" />
            ) : (
              <QuestionMarkIcon color="red" />
            )}
          </Flex>
          <Text lineClamp={1}>{title}</Text>
        </Flex>
      </Card>
    </Tooltip>
  );
};
