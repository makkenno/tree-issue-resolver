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
    edges: createEdges(tree),
  };
};

const createTreeNodesWithPosition = (
  tree: IssueTree,
  position: { x: number; y: number },
  options: { matches: boolean }
): { nodes: NodeType[]; totalHeight: number } => {
  const { id, title, isResolved, children, isCollapsed } = tree;
  const { x, y } = position;
  const { matches } = options;

  const currentNode = createNodeWithPosition(
    { 
      id, 
      title, 
      isResolved, 
      isCollapsed: isCollapsed || false,
      hasChildren: children.length > 0
    },
    { x, y }
  );

  let childY = y;
  const nodes = [currentNode];

  // 折りたたまれている場合は子ノードを非表示にする
  if (isCollapsed) {
    return { nodes, totalHeight: 40 };
  }

  // 半角文字数を計算
  const halfWidthCount = title.replace(
    /[\u4e00-\u9fa5\u3040-\u30ff\uFF00-\uFFEF]/g,
    ""
  ).length;
  // 全角文字数を計算
  const fullWidthCount = title.length - halfWidthCount;
  // 全角文字は半角文字の約2倍の幅と仮定
  const width = halfWidthCount * 0.5 + fullWidthCount;
  // xMarginを計算
  const xMargin = Math.min(width, 40) * (matches ? 20 : 16) + 160;

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

const createEdges = (tree: IssueTree): EdgeType[] => {
  const { id, children, isCollapsed } = tree;
  
  // 折りたたまれている場合は子のエッジを作成しない
  if (isCollapsed) {
    return [];
  }

  return children
    .map(child => [
      createEdge(id, child.id),
      ...createEdges(child),
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
    isCollapsed?: boolean;
    hasChildren?: boolean;
  };
};
const createNodeWithPosition = (
  data: {
    id: string;
    title: string;
    isResolved: boolean;
    isCollapsed?: boolean;
    hasChildren?: boolean;
  },
  position: { x: number; y: number }
): NodeType => {
  const { id, title, isResolved, isCollapsed, hasChildren } = data;
  return {
    id,
    position,
    type: "issueCard",
    data: {
      id,
      title,
      isResolved,
      isCollapsed,
      hasChildren,
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
