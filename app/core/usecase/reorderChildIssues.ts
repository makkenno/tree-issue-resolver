import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";

export class ReorderChildIssuesUseCase {
  constructor(private repository: IssueRepository) {}

  public async execute(parentId: string, childIds: string[]): Promise<void> {
    const parentIssueId = IssueId.fromString(parentId);
    const childIssueIds = childIds.map(id => IssueId.fromString(id));
    
    return this.repository.reorderChildIssues(parentIssueId, childIssueIds);
  }
}