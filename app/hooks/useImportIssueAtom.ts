import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";
import { ImportIssueUseCase } from "~/core/usecase/importIssue";
import { IssueNodeType } from "~/lib/zodSchema/issueTreeSchema";

type ImportIssueArgs = IssueNodeType;

const importIssueAtom = atom(null, async (_get, set, args: ImportIssueArgs) => {
  await new ImportIssueUseCase(new DexieIssueRepository()).execute({
    id: args.id,
    title: args.title,
    note: args.note,
    isResolved: args.isResolved,
    children: args.children,
  });
  set(refetchIssueTitlesAtom, (prev) => prev + 1);
});

export const useimportIssueAtom = () => {
  return useSetAtom(importIssueAtom);
};
