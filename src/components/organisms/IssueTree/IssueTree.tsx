import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FC } from "react";
import { useIssueTree } from "./_hooks/useIssueTree";
import { Box } from "@/components/atoms/Box/Box";

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
    <Box style={{ height: "80vh", border: "1px solid gray" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
    </Box>
  );
};
