import { atom, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { CreateRootUseCase } from "~/core/usecase/createRoot";
import { refetchIssueTitlesAtom } from "./useIssuesAtom";

type CreateRootIssueArgs = {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: {
    title: string;
  }[];
};

const createRootIssueAtom = atom(
  null,
  async (_get, set, args: CreateRootIssueArgs) => {
    await new CreateRootUseCase(new DexieIssueRepository()).execute({
      id: args.id,
      title: args.title,
      note: args.note,
      isResolved: args.isResolved,
      children: args.children.map((child) => ({
        id: crypto.randomUUID(),
        title: child.title,
      })),
    });
    set(refetchIssueTitlesAtom, (prev) => prev + 1);
  }
);

export const useCreateRootIssueAtom = () => {
  return useSetAtom(createRootIssueAtom);
};
