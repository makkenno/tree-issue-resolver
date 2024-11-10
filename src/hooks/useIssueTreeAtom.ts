import { IssueTree } from "@/components/organisms/IssueTree/IssueTree";
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
