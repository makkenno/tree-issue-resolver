import { IssueCard } from "./IssueCard";
import { Link } from "~/components/atoms/Link/Link";
import { Handle, Position } from "@xyflow/react";
import { FC } from "react";
import { useParams } from "@remix-run/react";

export interface IssueCardNodeProps {
  data: { id: string; title: string; isResolved: boolean };
}

export const IssueCardNode: FC<IssueCardNodeProps> = ({ data }) => {
  const { treeId } = useParams();
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Link to={`/edit/${treeId}/${data.id}`}>
        <IssueCard title={data.title} isResolved={data.isResolved} />
      </Link>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
