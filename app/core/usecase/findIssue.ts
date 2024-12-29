import { Issue } from "../domain/domain-entity/Issue";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";
import { IssueType } from "./IssueType";

interface FindIssueInput {
  id: string;
}

export interface FindIssueOutput {
  issue: IssueType;
}

export class FindIssueUseCase {
  constructor(private repository: IssueRepository) {}

  async execute(input: FindIssueInput): Promise<FindIssueOutput | undefined> {
    const issue = await this.repository.findIssueSubtree(
      IssueId.fromString(input.id)
    );
    if (issue === undefined) return undefined;
    return { issue: this.createResponse(issue) };
  }

  private createResponse(issue: Issue): IssueType {
    return {
      id: issue.id.value,
      title: issue.title.value,
      note: issue.note.value,
      isResolved: issue.isResolved,
      children: issue.children.map((child) => this.createResponse(child)),
    };
  }
}
