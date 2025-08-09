import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { UpdateIssueUseCase } from "~/core/usecase/updateIssue";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";
import { refetchIssueTreeAtom } from "./useIssueRootAtom";
import { refetchIssueNodeAtom } from "./useIssueNodeAtom";

const toggleNodeCollapseAtom = atom(
  null,
  async (_get, set, args: { 
    id: string; 
    title: string; 
    note: string; 
    isResolved: boolean; 
    isCollapsed: boolean; 
    children: { id: string; title: string }[] 
  }) => {
    await new UpdateIssueUseCase(new DexieIssueRepository()).execute({
      id: args.id,
      title: args.title,
      note: args.note,
      isResolved: args.isResolved,
      isCollapsed: !args.isCollapsed, // トグル
      children: args.children,
    });
    
    set(refetchIssueTitlesAtom, (prev) => prev + 1);
    set(refetchIssueTreeAtom, (prev) => prev + 1);
    set(refetchIssueNodeAtom, (prev) => prev + 1);
  }
);

export const useToggleNodeCollapseAtom = () => {
  return useSetAtom(toggleNodeCollapseAtom);
};