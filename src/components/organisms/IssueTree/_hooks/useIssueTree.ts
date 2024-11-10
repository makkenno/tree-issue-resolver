import { ReactFlowProps } from "@xyflow/react";
import { IssueTree } from "../IssueTree";
import { FC, useMemo } from "react";
import {
  IssueCardNode,
  IssueCardNodeProps,
} from "../_components/IssueCardNode";
import { treeToNodesAndeEdges } from "./_lib/treeToNodesAndEdges";

type IssueTreeHookType = (tree: IssueTree) => {
  nodes: ReactFlowProps["nodes"];
  edges: ReactFlowProps["edges"];
  nodeTypes: {
    issueCard: FC<IssueCardNodeProps>;
  };
};

export const useIssueTree: IssueTreeHookType = (tree) => {
  const { nodes, edges } = treeToNodesAndeEdges(tree);
  const nodeTypes = useMemo(() => ({ issueCard: IssueCardNode }), []);
  return {
    nodes,
    edges,
    nodeTypes,
  };
};
