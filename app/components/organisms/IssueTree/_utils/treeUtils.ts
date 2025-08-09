import { IssueNodeType } from "~/lib/zodSchema/issueTreeSchema";

/**
 * ツリーデータから指定されたIDのノードを検索する
 */
export const findNodeInTree = (
  tree: IssueNodeType,
  targetId: string
): IssueNodeType | null => {
  if (tree.id === targetId) return tree;
  for (const child of tree.children || []) {
    const found = findNodeInTree(child, targetId);
    if (found) return found;
  }
  return null;
};

/**
 * 指定されたノードとその子ノードをツリー構造のまま新しいIDと共にディープコピーする
 * @param node - 複製するノード
 * @returns 新しいIDを持つ複製されたノードとその子ノードのツリー
 */
export const cloneNodeWithChildren = (node: IssueNodeType): IssueNodeType => {
  const newId = crypto.randomUUID();

  const clonedChildren = node.children
    ? node.children.map((child: IssueNodeType) => cloneNodeWithChildren(child))
    : [];

  return {
    ...node,
    id: newId,
    children: clonedChildren,
    isResolved: false,
    isCollapsed: false,
  };
};
