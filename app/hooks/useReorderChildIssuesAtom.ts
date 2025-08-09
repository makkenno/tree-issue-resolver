import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { ReorderChildIssuesUseCase } from "~/core/usecase/reorderChildIssues";
import { refetchIssueTreeAtom } from "./useIssueRootAtom";
import { refetchIssueNodeAtom } from "./useIssueNodeAtom";

type ReorderChildIssuesArgs = {
  parentId: string;
  childIds: string[];
};

const reorderChildIssuesAtom = atom(
  null,
  async (_get, set, args: ReorderChildIssuesArgs): Promise<void> => {
    await new ReorderChildIssuesUseCase(new DexieIssueRepository()).execute(
      args.parentId,
      args.childIds
    );
    
    set(refetchIssueTreeAtom, (prev) => prev + 1);
    set(refetchIssueNodeAtom, (prev) => prev + 1);
  }
);

export const useReorderChildIssuesAtom = () => {
  return useSetAtom(reorderChildIssuesAtom);
};