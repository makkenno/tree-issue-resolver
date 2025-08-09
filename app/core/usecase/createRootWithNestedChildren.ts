import { Issue } from "../domain/domain-entity/Issue";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";
import { IssueNote } from "../domain/value-object/IssueNote";
import { IssueTitle } from "../domain/value-object/IssueTitle";
import { IssueType } from "./IssueType";

interface CreateRootWithNestedChildrenInput {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  isCollapsed?: boolean;
  children: CreateRootWithNestedChildrenInput[];
}

export class CreateRootWithNestedChildrenUseCase {
  constructor(private repository: IssueRepository) {}

  public async execute(input: CreateRootWithNestedChildrenInput): Promise<void> {
    const issue = this.convertInputToIssue(input);
    await this.repository.saveRoot(issue);
  }

  private convertInputToIssue(input: CreateRootWithNestedChildrenInput): Issue {
    return new Issue(
      IssueId.fromString(input.id),
      new IssueTitle(input.title),
      new IssueNote(input.note),
      input.isResolved,
      input.children.map((child) => this.convertInputToIssue(child)),
      new Date(),
      input.isCollapsed || false
    );
  }

  // IssueTypeからの変換もサポート
  public async executeFromIssueType(issueType: IssueType): Promise<void> {
    const issue = Issue.fromObject(issueType);
    await this.repository.saveRoot(issue);
  }
}