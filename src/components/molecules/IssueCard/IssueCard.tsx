import { Box } from "@/components/atoms/Box/Box";
import { Card } from "@/components/atoms/Card/Card";
import { Flex } from "@/components/atoms/Flex/Flex";
import { CheckCircleIcon } from "@/components/atoms/Icon/CheckCircle/CheckCircle";
import { QuestionMarkIcon } from "@/components/atoms/Icon/QuestionMark/QuestionMark";
import { Text } from "@/components/atoms/Text/Text";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";
import { FC } from "react";

interface IssueCardProps {
  title: string;
  isResolved: boolean;
}

const MAX_LETTER_LENGTH = 24;

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
        <Flex gap="xs">
          <Box h="24px">
            {isResolved ? (
              <CheckCircleIcon color="green" />
            ) : (
              <QuestionMarkIcon color="red" />
            )}
          </Box>
          <Text lineClamp={1}>{title}</Text>
        </Flex>
      </Card>
    </Tooltip>
  );
};