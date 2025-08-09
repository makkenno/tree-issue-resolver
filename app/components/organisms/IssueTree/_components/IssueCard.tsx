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
  isCollapsed?: boolean;
  hasChildren?: boolean;
  onToggleResolved?: () => void;
  onToggleCollapse?: () => void;
}

const MAX_LETTER_LENGTH = 40;

export const IssueCard: FC<IssueCardProps> = ({ 
  title, 
  isResolved, 
  isCollapsed = false, 
  hasChildren = false,
  onToggleResolved,
  onToggleCollapse
}) => {
  // 枠線なし、アイコンのみで表現

  return (
    <Tooltip
      label={`${title}${hasChildren ? (isCollapsed ? ' (折りたたまれています)' : ' (展開されています)') : ''}`}
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
          <Flex align="center" gap={2}>
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
            
            {/* 折りたたみ状態のインジケーター - クリック可能 */}
            {hasChildren && (
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleCollapse?.();
                }}
                style={{ 
                  cursor: onToggleCollapse ? "pointer" : "default",
                  transition: "transform 0.1s ease",
                  fontSize: '12px'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {isCollapsed ? '📁' : '📂'}
              </ActionIcon>
            )}
          </Flex>
          <Text lineClamp={1}>{title}</Text>
        </Flex>
      </Card>
    </Tooltip>
  );
};
