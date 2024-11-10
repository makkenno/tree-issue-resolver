import { ReactFlowProps } from "@xyflow/react";
import { IssueTree } from "../../IssueTree";

type TreeToNodesAndeEdges = (tree: IssueTree) => {
  nodes: Required<ReactFlowProps["nodes"]>;
  edges: Required<ReactFlowProps["edges"]>;
};

export const treeToNodesAndeEdges: TreeToNodesAndeEdges = (tree) => {
  const { id, title, isResolved, children } = tree;

  return {
    nodes: [
      createNode(id, title, isResolved),
      ...createChildrenNodesRecursively(children, 1),
    ],
    edges: createEdges(id, children),
  };
};

const createChildrenNodesRecursively = (
  children: IssueTree[],
  rank: number
): NodeType[] => {
  return children
    .map(({ id, title, isResolved, children: grandChildren }, i) => [
      createNode(id, title, isResolved),
      ...createChildrenNodesRecursively(grandChildren, rank + 1),
    ])
    .flat();
};

const createEdges = (parentId: string, children: IssueTree[]): EdgeType[] => {
  return children
    .map(({ id, children: grandChildren }) => [
      createEdge(parentId, id),
      ...createEdges(id, grandChildren),
    ])
    .flat();
};

type NodeType = {
  id: string;
  position: { x: number; y: number };
  type: "issueCard";
  data: {
    id: string;
    title: string;
    isResolved: boolean;
  };
};
const createNode = (
  id: string,
  title: string,
  isResolved: boolean
): NodeType => {
  return {
    id,
    position: { x: 0, y: 0 },
    type: "issueCard",
    data: {
      id,
      title,
      isResolved,
    },
  };
};

type EdgeType = {
  id: `${string}-${string}`;
  source: string;
  target: string;
};
const createEdge = (parentId: string, childId: string): EdgeType => {
  return {
    id: `${parentId}-${childId}`,
    source: parentId,
    target: childId,
  };
};
