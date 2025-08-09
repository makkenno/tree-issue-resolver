import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { CreateRootUseCase, CreateRootInput } from "~/core/usecase/createRoot";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";

type CreateRootIssueArgs = CreateRootInput;

const createRootIssueAtom = atom(
  null,
  async (_get, set, args: CreateRootIssueArgs) => {
    await new CreateRootUseCase(new DexieIssueRepository()).execute(args);
    set(refetchIssueTitlesAtom, (prev) => prev + 1);
  }
);

export const useCreateRootIssueAtom = () => {
  return useSetAtom(createRootIssueAtom);
};
