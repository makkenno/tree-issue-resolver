import { FC } from "react";
import { Card } from "~/components/atoms/Card/Card";
import { Flex } from "~/components/atoms/Flex/Flex";
import { CheckCircleIcon } from "~/components/atoms/Icon/CheckCircle/CheckCircle";
import { QuestionMarkIcon } from "~/components/atoms/Icon/QuestionMark/QuestionMark";
import { Text } from "~/components/atoms/Text/Text";
import { Tooltip } from "~/components/atoms/Tooltip/Tooltip";

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
