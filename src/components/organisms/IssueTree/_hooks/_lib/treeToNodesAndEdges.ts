import { ReactFlowProps } from "@xyflow/react";
import { IssueTree } from "../../IssueTree";

type TreeToNodesAndeEdges = (
  tree: IssueTree,
  options: { matches: boolean }
) => {
  nodes: Required<ReactFlowProps["nodes"]>;
  edges: Required<ReactFlowProps["edges"]>;
};

export const treeToNodesAndeEdges: TreeToNodesAndeEdges = (
  tree,
  { matches }
) => {
  const { id, children } = tree;
  const { nodes } = createTreeNodesWithPosition(
    tree,
    { x: 40, y: 40 },
    { matches }
  );

  return {
    nodes,
    edges: createEdges(id, children),
  };
};

const createTreeNodesWithPosition = (
  tree: IssueTree,
  position: { x: number; y: number },
  options: { matches: boolean }
): { nodes: NodeType[]; totalHeight: number } => {
  const { id, title, isResolved, children } = tree;
  const { x, y } = position;
  const { matches } = options;

  const currentNode = createNodeWithPosition(
    { id, title, isResolved },
    { x, y }
  );

  let childY = y;
  const nodes = [currentNode];
  const xMargin = Math.min(title.length, 40) * (matches ? 20 : 16) + 160;

  children.forEach((child, i) => {
    const { nodes: childNodes, totalHeight } = createTreeNodesWithPosition(
      child,
      {
        x: x + xMargin,
        y: childY,
      },
      { matches }
    );
    nodes.push(...childNodes);
    const isLastChild = i === children.length - 1;
    childY += isLastChild ? totalHeight : totalHeight + 60; // 子ノードの高さとスペースを加算して次の子のy位置を調整
  });

  const totalHeight = Math.max(40, childY - y); // 子が１つしかない時は固定値
  return { nodes, totalHeight };
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
const createNodeWithPosition = (
  data: {
    id: string;
    title: string;
    isResolved: boolean;
  },
  position: { x: number; y: number }
): NodeType => {
  const { id, title, isResolved } = data;
  return {
    id,
    position,
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
