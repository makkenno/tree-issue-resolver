import { Card } from "@/components/atoms/Card/Card";
import { Text } from "@/components/atoms/Text/Text";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";
import { FC } from "react";

interface IssueCardProps {
  title: string;
}

const MAX_LETTER_LENGTH = 24;

export const IssueCard: FC<IssueCardProps> = ({ title }) => {
  return (
    <Tooltip
      label={title}
      disabled={title.length < MAX_LETTER_LENGTH - 1}
      multiline
    >
      <Card
        withBorder
        w="max-content"
        maw={`${MAX_LETTER_LENGTH}em`}
        padding="sm"
      >
        <Text lineClamp={1}>{title}</Text>
      </Card>
    </Tooltip>
  );
};
