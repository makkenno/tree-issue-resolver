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
  const [_, setIssueTreeId] = useAtom(issueTreeIdAtom);
  return setIssueTreeId;
};

export const useIssueTreeAtom = () => {
  const [issueNode, _] = useAtom(issueTreeAtom);
  return issueNode;
};
