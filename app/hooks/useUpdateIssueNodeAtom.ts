import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { UpdateIssueUseCase } from "~/core/usecase/updateIssue";
import { refetchIssueTreeAtom } from "./useIssueRootAtom";
import { refetchIssueNodeAtom } from "./useIssueNodeAtom";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";

type UpdateIssueNodeArgs = {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: {
    id: string;
    title: string;
  }[];
};

const updateIssueNodeAtom = atom(
  null,
  async (_get, set, args: UpdateIssueNodeArgs) => {
    await new UpdateIssueUseCase(new DexieIssueRepository()).execute({
      id: args.id,
      title: args.title,
      note: args.note,
      isResolved: args.isResolved,
      children: args.children.map((child) => ({
        id: child.id,
        title: child.title,
      })),
    });
    set(refetchIssueTitlesAtom, (prev) => prev + 1);
    set(refetchIssueTreeAtom, (prev) => prev + 1);
    set(refetchIssueNodeAtom, (prev) => prev + 1);
  }
);

export const useUpdateIssueNodeAtom = () => {
  return useSetAtom(updateIssueNodeAtom);
};
