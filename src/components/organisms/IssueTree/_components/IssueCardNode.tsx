import { IssueCard } from "@/components/molecules/IssueCard/IssueCard";
import { Handle, Position } from "@xyflow/react";
import { FC } from "react";

export interface IssueCardNodeProps {
  data: { id: string; title: string; isResolved: boolean };
}

export const IssueCardNode: FC<IssueCardNodeProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <IssueCard title={data.title ?? ""} isResolved={data.isResolved} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};
