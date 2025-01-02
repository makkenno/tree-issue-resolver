import { atom, useAtomValue } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { GetIssuesUseCase } from "~/core/usecase/getIssues";
import { issueTitlesSchema } from "~/lib/zodSchema/issueTitleSchema";

export const refetchIssueTitlesAtom = atom(0);

const issueTitlesAtom = atom(async (get) => {
  get(refetchIssueTitlesAtom);
  const issueTitles = await new GetIssuesUseCase(
    new DexieIssueRepository()
  ).execute();
  return issueTitlesSchema.parse(issueTitles);
});

export const useIssueTitlesAtom = () => {
  return useAtomValue(issueTitlesAtom);
};
