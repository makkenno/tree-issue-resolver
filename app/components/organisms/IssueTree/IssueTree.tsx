import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FC, useEffect } from "react";
import { useIssueTree } from "./_hooks/useIssueTree";
import { Box } from "../../atoms/Box/Box";
import { IssueCardNode } from "./_components/IssueCardNode";

export type IssueTree = {
  id: string;
  title: string;
  isResolved: boolean;
  children: IssueTree[];
};

interface IssueTreeProps {
  tree: IssueTree;
}

const IssueTreeContent: FC<IssueTreeProps> = ({ tree }) => {
  const { nodes, edges } = useIssueTree(tree);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
      }, 100);
    }
  }, [nodes, edges, reactFlowInstance]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ issueCard: IssueCardNode }}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      fitView
      fitViewOptions={{ padding: 0.1 }}
    />
  );
};

export const IssueTree: FC<IssueTreeProps> = ({ tree }) => {
  return (
    <Box style={{ height: "80vh", border: "1px solid gray" }}>
      <ReactFlowProvider>
        <IssueTreeContent tree={tree} />
      </ReactFlowProvider>
    </Box>
  );
};
