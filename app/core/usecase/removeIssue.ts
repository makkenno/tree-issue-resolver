import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";

interface RemoveIssueInput {
  id: string;
}

export class RemoveIssueUseCase {
  constructor(private repository: IssueRepository) {}
  public async execute(input: RemoveIssueInput): Promise<void> {
    await this.repository.removeIssue(IssueId.fromString(input.id));
  }
}
