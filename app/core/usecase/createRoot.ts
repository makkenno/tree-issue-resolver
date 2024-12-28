import { Issue } from "../domain/domain-entity/Issue";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";
import { IssueNote } from "../domain/value-object/IssueNote";
import { IssueTitle } from "../domain/value-object/IssueTitle";

interface CreateRootInput {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: {
    id: string;
    title: string;
  }[];
}

export class CreateRootUseCase {
  constructor(private repository: IssueRepository) {}
  public async execute(input: CreateRootInput): Promise<void> {
    const issue = new Issue(
      IssueId.fromString(input.id),
      new IssueTitle(input.title),
      new IssueNote(input.note),
      input.isResolved,
      input.children.map(
        (child) =>
          new Issue(
            IssueId.fromString(child.id),
            new IssueTitle(child.title),
            new IssueNote(""),
            false,
            [],
            new Date()
          )
      ),
      new Date()
    );
    await this.repository.saveRoot(issue);
  }
}
