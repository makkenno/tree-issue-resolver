import { Issue } from "../domain/domain-entity/Issue";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueType } from "./IssueType";

type ImportIssueInput = IssueType;

export class ImportIssueUseCase {
  constructor(private repository: IssueRepository) {}
  public async execute(input: ImportIssueInput): Promise<void> {
    await this.repository.saveRoot(Issue.fromObject(input));
  }
}
