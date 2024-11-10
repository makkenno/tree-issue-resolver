import { ReactFlowProps } from "@xyflow/react";
import { IssueTree } from "../../IssueTree";

type TreeToNodesAndeEdges = (tree: IssueTree) => {
  nodes: Required<ReactFlowProps["nodes"]>;
  edges: Required<ReactFlowProps["edges"]>;
};

export const treeToNodesAndeEdges: TreeToNodesAndeEdges = (tree) => {
  const { id, children } = tree;
  const { nodes } = createTreeNodesWithPosition(tree, { x: 0, y: 0 });

  return {
    nodes,
    edges: createEdges(id, children),
  };
};

const createTreeNodesWithPosition = (
  tree: IssueTree,
  position: { x: number; y: number }
): { nodes: NodeType[]; totalHeight: number } => {
  const { id, title, isResolved, children } = tree;
  const { x, y } = position;

  const currentNode = createNodeWithPosition(
    { id, title, isResolved },
    { x, y }
  );

  let childY = y;
  const nodes = [currentNode];

  children.forEach((child, i) => {
    const { nodes: childNodes, totalHeight } = createTreeNodesWithPosition(
      child,
      {
        x: x + 240,
        y: childY,
      }
    );
    nodes.push(...childNodes);
    const isLastChild = i === children.length - 1;
    childY += isLastChild ? totalHeight : totalHeight + 20; // 子ノードの高さとスペースを加算して次の子のy位置を調整
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