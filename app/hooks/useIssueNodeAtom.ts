import { atom, useAtom } from "jotai";
import { z } from "zod";
import { DexieIssueRepository } from "~/core/infra/repository/IssueRepositoryImpl";
import { FindIssueUseCase } from "~/core/usecase/findIssue";

const baseIssueNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  note: z.string(),
  isResolved: z.boolean(),
});

export type IssueNodeType = z.infer<typeof baseIssueNodeSchema> & {
  children: IssueNodeType[];
};

const issueTreeSchema: z.ZodType<IssueNodeType> = baseIssueNodeSchema.extend({
  children: z.lazy(() => issueTreeSchema.array()),
});

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
