import { ReactFlowProps } from "@xyflow/react";
import { IssueTree } from "../IssueTree";
import { treeToNodesAndeEdges } from "./_lib/treeToNodesAndEdges";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

type IssueTreeHookType = (tree: IssueTree) => {
  nodes: ReactFlowProps["nodes"];
  edges: ReactFlowProps["edges"];
};

export const useIssueTree: IssueTreeHookType = (tree) => {
  const matches = !!useMediaQuery();
  const { nodes, edges } = treeToNodesAndeEdges(tree, { matches });
  return {
    nodes,
    edges,
  };
};
