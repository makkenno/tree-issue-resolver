import { atom, useAtomValue, useSetAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { FindIssueUseCase } from "~/core/usecase/findIssue";
import { issueTreeSchema } from "~/lib/zodSchema/issueTreeSchema";

export const refetchIssueTreeAtom = atom(0);
const issueTreeIdAtom = atom<string | undefined>(undefined);

const issueTreeAtom = atom(async (get) => {
  get(refetchIssueTreeAtom);
  const nodeId = get(issueTreeIdAtom);
  if (!nodeId) {
    return undefined;
  }
  const issueNode = await new FindIssueUseCase(
    new DexieIssueRepository()
  ).execute({ id: nodeId });
  if (!issueNode) {
    return undefined;
  }
  return issueTreeSchema.parse(issueNode.issue);
});

export const useSetIssueTreeIdAtom = () => {
  return useSetAtom(issueTreeIdAtom);
};

export const useIssueTreeAtom = () => {
  return useAtomValue(issueTreeAtom);
};
