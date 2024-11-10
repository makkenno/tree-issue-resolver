import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FC } from "react";
import { useIssueTree } from "./_hooks/useIssueTree";

export type IssueTree = {
  id: string;
  title: string;
  isResolved: boolean;
  children: IssueTree[];
};

interface IssueTreeProps {
  tree: IssueTree;
}

export const IssueTree: FC<IssueTreeProps> = ({ tree }) => {
  const { nodes, edges, nodeTypes } = useIssueTree(tree);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
    </div>
  );
};
