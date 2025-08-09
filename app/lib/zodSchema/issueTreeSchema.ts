import { z } from "zod";

const baseIssueNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  note: z.string(),
  isResolved: z.boolean(),
  isCollapsed: z.boolean().optional(),
});

export type IssueNodeType = z.infer<typeof baseIssueNodeSchema> & {
  children: IssueNodeType[];
};

export const issueTreeSchema: z.ZodType<IssueNodeType> =
  baseIssueNodeSchema.extend({
    children: z.lazy(() => issueTreeSchema.array()),
  });
