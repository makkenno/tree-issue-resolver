import { atom, useAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { RemoveIssueUseCase } from "~/core/usecase/removeIssue";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";

const removeIssueAtom = atom(null, async (_get, set, args: { id: string }) => {
  await new RemoveIssueUseCase(new DexieIssueRepository()).execute({
    id: args.id,
  });
  set(refetchIssueTitlesAtom, (prev) => prev + 1);
});

export const useRemoveIssueAtom = () => {
  const [_, removeIssue] = useAtom(removeIssueAtom);
  return removeIssue;
};
