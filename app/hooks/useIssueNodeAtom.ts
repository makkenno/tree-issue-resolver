import { atom, useAtom } from "jotai";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { FindIssueUseCase } from "~/core/usecase/findIssue";
import { issueTreeSchema } from "~/lib/zodSchema/issueTreeSchema";

const issueNodeIdAtom = atom<string | undefined>(undefined);
export const refetchIssueNodeAtom = atom(0);

const issueNodeAtom = atom(async (get) => {
  get(refetchIssueNodeAtom);
  const nodeId = get(issueNodeIdAtom);
  if (!nodeId) {
    return undefined;
  }
  const issueNode = await new FindIssueUseCase(
    new DexieIssueRepository()
  ).execute({ id: nodeId });
  if (!issueNode) return undefined;
  return issueTreeSchema.parse(issueNode?.issue);
});

export const useSetIssueNodeIdAtom = () => {
  const [_, setIssueNodeId] = useAtom(issueNodeIdAtom);
  return setIssueNodeId;
};

export const useIssueNodeAtom = () => {
  const [issueNode, _] = useAtom(issueNodeAtom);
  return issueNode;
};
