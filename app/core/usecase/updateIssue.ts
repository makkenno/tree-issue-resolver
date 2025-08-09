import { Issue } from "../domain/domain-entity/Issue";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";
import { IssueNote } from "../domain/value-object/IssueNote";
import { IssueTitle } from "../domain/value-object/IssueTitle";

interface UpdateIssueInput {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  isCollapsed?: boolean;
  children: {
    id: string;
    title: string;
  }[];
}

export class UpdateIssueUseCase {
  constructor(private repository: IssueRepository) {}

  public async execute(input: UpdateIssueInput): Promise<void> {
    const existIssue = await this.repository.findIssueSubtree(
      IssueId.fromString(input.id)
    );

    if (!existIssue) throw new Error("Issue not found");

    const childrenToUpdate = input.children.map((inputChild) => {
      const existChild = existIssue.children.find((child) =>
        child.id.isEqual(IssueId.fromString(inputChild.id))
      );
      if (existChild) {
        return new Issue(
          IssueId.fromString(inputChild.id),
          new IssueTitle(inputChild.title),
          existChild.note,
          existChild.isResolved,
          existChild.children,
          existChild.createdAt,
          existChild.isCollapsed
        );
      }
      return new Issue(
        IssueId.fromString(inputChild.id),
        new IssueTitle(inputChild.title),
        new IssueNote(""),
        false,
        [],
        new Date(),
        false
      );
    });

    const updated = new Issue(
      IssueId.fromString(input.id),
      new IssueTitle(input.title),
      new IssueNote(input.note),
      input.isResolved,
      childrenToUpdate,
      new Date(),
      input.isCollapsed !== undefined ? input.isCollapsed : existIssue.isCollapsed
    );

    await this.repository.updateIssue(updated);
  }
}
