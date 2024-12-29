import { Issue } from "~/core/domain/domain-entity/Issue";
import { IssueId } from "~/core/domain/value-object/IssueId";

export interface IssueRepository {
  getIssues(): Promise<{ id: string; title: string }[]>;
  findIssueSubtree(issueId: IssueId): Promise<Issue | undefined>;
  saveRoot(issue: Issue): Promise<void>;
  updateIssue(issue: Issue): Promise<void>;
  removeIssue(issueId: IssueId): Promise<void>;
}
