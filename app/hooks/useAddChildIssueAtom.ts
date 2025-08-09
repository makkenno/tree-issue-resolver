import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { AddChildIssueUseCase } from "~/core/usecase/addChildIssue";
import { refetchIssueTreeAtom } from "./useIssueRootAtom";
import { refetchIssueNodeAtom } from "./useIssueNodeAtom";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";

type AddChildIssueArgs = {
  parentId: string;
  childTitle: string;
};

const addChildIssueAtom = atom(
  null,
  async (_get, set, args: AddChildIssueArgs): Promise<string> => {
    const newChildId = await new AddChildIssueUseCase(new DexieIssueRepository()).execute({
      parentId: args.parentId,
      childTitle: args.childTitle,
    });
    
    set(refetchIssueTitlesAtom, (prev) => prev + 1);
    set(refetchIssueTreeAtom, (prev) => prev + 1);
    set(refetchIssueNodeAtom, (prev) => prev + 1);
    
    return newChildId;
  }
);

export const useAddChildIssueAtom = () => {
  return useSetAtom(addChildIssueAtom);
};