import { IssueRepository } from "../domain/repository/IssueRepository";

export class GetIssuesUseCase {
  constructor(private repository: IssueRepository) {}
  public async execute(): Promise<{ id: string; title: string }[]> {
    return this.repository.getIssues();
  }
}
