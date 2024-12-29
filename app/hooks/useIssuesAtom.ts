import { atom, useAtom } from "jotai";
import { z } from "zod";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { CreateRootUseCase } from "~/core/usecase/createRoot";
import { GetIssuesUseCase } from "~/core/usecase/getIssues";

const issueTitlesSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
  })
  .array();

export type IssueTitlesType = z.infer<typeof issueTitlesSchema>;

type CreateRootIssueArgs = {
  title: string;
  note: string;
  isResolved: boolean;
  children: {
    title: string;
  }[];
};

const refetchIssueTitlesAtom = atom(0);

const issueTitlesAtom = atom(async (get) => {
  get(refetchIssueTitlesAtom);
  const issueTitles = await new GetIssuesUseCase(
    new DexieIssueRepository()
  ).execute();
  return issueTitlesSchema.parse(issueTitles);
});

const createRootIssueAtom = atom(
  null,
  async (_get, set, args: CreateRootIssueArgs) => {
    await new CreateRootUseCase(new DexieIssueRepository()).execute({
      id: crypto.randomUUID(),
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

export const useIssueTitlesAtom = () => {
  const [issueTitles] = useAtom(issueTitlesAtom);
  return issueTitles;
};

export const useCreateRootIssueAtom = () => {
  const [_, createRootIssue] = useAtom(createRootIssueAtom);
  return createRootIssue;
};
