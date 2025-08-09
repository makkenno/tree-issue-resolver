/**
 * ツリーデータから指定されたIDのノードを検索する
 */
export const findNodeInTree = (tree: any, targetId: string): any => {
  if (tree.id === targetId) return tree;
  for (const child of tree.children || []) {
    const found = findNodeInTree(child, targetId);
    if (found) return found;
  }
  return null;
};