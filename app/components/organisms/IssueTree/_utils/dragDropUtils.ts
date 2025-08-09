import { IssueTree } from "../IssueTree";

/**
 * 指定されたノードの親ノードIDを再帰的に検索する
 */
export const findNodeParent = (nodeId: string, currentTree: IssueTree): string | null => {
  if (currentTree.children.some(child => child.id === nodeId)) {
    return currentTree.id;
  }
  for (const child of currentTree.children) {
    const parent = findNodeParent(nodeId, child);
    if (parent) return parent;
  }
  return null;
};

/**
 * 指定された親ノードの子ノードIDの配列を取得する
 */
export const findChildrenOrder = (parentId: string, currentTree: IssueTree): string[] => {
  if (currentTree.id === parentId) {
    return currentTree.children.map(child => child.id);
  }
  for (const child of currentTree.children) {
    const result = findChildrenOrder(parentId, child);
    if (result.length > 0) return result;
  }
  return [];
};

/**
 * 配列内の要素を指定されたインデックス間で移動する
 */
export const reorderArray = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const newArray = [...array];
  const [removed] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, removed);
  return newArray;
};

/**
 * ドラッグ&ドロップによる並び替えが有効かどうかを判定する
 */
export const isValidReorder = (
  activeIndex: number,
  overIndex: number
): boolean => {
  return activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex;
};

/**
 * 指定されたノードIDから子ツリー全体を取得する
 */
export const findSubtree = (nodeId: string, currentTree: IssueTree): IssueTree | null => {
  if (currentTree.id === nodeId) {
    return currentTree;
  }
  for (const child of currentTree.children) {
    const found = findSubtree(nodeId, child);
    if (found) return found;
  }
  return null;
};