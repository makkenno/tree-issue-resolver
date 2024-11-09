import { Card } from "@/components/atoms/Card/Card";
import { FC } from "react";

interface IssueCardProps {
  title: string;
  href: string;
}

export const IssueCard: FC<IssueCardProps> = ({ href, title }) => {
  return (
    <Card>
      <Card.Section component="a" href={href}>
        {title}
      </Card.Section>
    </Card>
  );
};
