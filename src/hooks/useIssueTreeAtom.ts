import { useAtom } from "jotai";
import { RESET, atomWithStorage } from "jotai/utils";
import { useCallback } from "react";

type IssueTreeAtom = {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: IssueTreeAtom[];
};

const issueTreeAtom = atomWithStorage<IssueTreeAtom>("issueTree", {
  id: "",
  title: "",
  note: "",
  isResolved: false,
  children: [],
});

type CreateRootIssueArgs = {
  title: string;
  note: string;
  isResolved: boolean;
  children: {
    title: string;
  }[];
};

// Note: 一階層までしか扱わない
export const useCreateRootIssueAtom = () => {
  const [_, setIssueTree] = useAtom(issueTreeAtom);
  const createRootIssue = useCallback((args: CreateRootIssueArgs) => {
    const rootIssue = {
      id: crypto.randomUUID() as string,
      ...args,
      children: args.children.map((child) => ({
        id: crypto.randomUUID() as string,
        note: "",
        isResolved: false,
        children: [],
        ...child,
      })),
    };

    setIssueTree(rootIssue);
  }, []);
  return createRootIssue;
};

export const useGetIssueTreeAtom = () => {
  const [issueTree, _] = useAtom(issueTreeAtom);
  return issueTree;
};

export const useClearIssueTreeAtom = () => {
  const [_, setIssueTree] = useAtom(issueTreeAtom);
  const clearIssueTree = useCallback(() => {
    setIssueTree(RESET);
  }, []);
  return clearIssueTree;
};

// 特定のノードを編集するフック
type EditIssueArgs = {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children?: {
    title: string;
  }[];
};

// DANGER: どう考えてもバグるので注意
export const useEditIssueNodeAtom = () => {
  const [_, setIssueTree] = useAtom(issueTreeAtom);

  const editIssueNode = useCallback(
    (args: EditIssueArgs) => {
      const editNodeRecursively = (node: IssueTreeAtom): IssueTreeAtom => {
        if (node.id === args.id) {
          // ノードが見つかった場合、引数で渡された値を更新
          return {
            ...node,
            ...args,
            children: args.children
              ? args.children.map((child) => ({
                  id: crypto.randomUUID(),
                  note: "",
                  isResolved: false,
                  children: [],
                  ...child,
                }))
              : node.children, // 新しいchildrenが提供されなかった場合は既存のchildrenを保持
          };
        }

        return {
          ...node,
          children: node.children.map(editNodeRecursively), // 子ノードに対しても再帰的に適用
        };
      };

      setIssueTree((prevTree) => editNodeRecursively(prevTree));
    },
    [setIssueTree]
  );

  return editIssueNode;
};

export const useGetIssueNodeWithChildrenAtom = (nodeId: string) => {
  const [issueTree, _] = useAtom(issueTreeAtom);

  const getNodeWithChildren = useCallback(
    (node: IssueTreeAtom): IssueTreeAtom | null => {
      if (node.id === nodeId) {
        // 指定されたIDのノードが見つかったらそのノードとその一階層の子ノードを返す
        return {
          ...node,
          children: node.children,
        };
      }

      // 見つからなかった場合、子ノードを再帰的に探索
      for (const child of node.children) {
        const result = getNodeWithChildren(child);
        if (result) return result;
      }

      return null;
    },
    [nodeId]
  );

  const result = getNodeWithChildren(issueTree);
  if (!result) throw new Error("not found");
  return result;
};
