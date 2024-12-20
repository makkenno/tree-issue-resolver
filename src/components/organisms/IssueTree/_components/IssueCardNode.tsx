import { IssueCard } from "@/components/molecules/IssueCard/IssueCard";
import { Link } from "@tanstack/react-router";
import { Handle, Position } from "@xyflow/react";
import { FC } from "react";

export interface IssueCardNodeProps {
  data: { id: string; title: string; isResolved: boolean };
}

export const IssueCardNode: FC<IssueCardNodeProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Link from="/" to="/index/$nodeId/edit" params={{ nodeId: data.id }}>
        <IssueCard title={data.title ?? ""} isResolved={data.isResolved} />
      </Link>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
