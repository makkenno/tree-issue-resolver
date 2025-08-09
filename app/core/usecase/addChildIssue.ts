import { Issue } from "../domain/domain-entity/Issue";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { IssueId } from "../domain/value-object/IssueId";
import { IssueNote } from "../domain/value-object/IssueNote";
import { IssueTitle } from "../domain/value-object/IssueTitle";

interface AddChildIssueInput {
  parentId: string;
  childTitle: string;
}

export class AddChildIssueUseCase {
  constructor(private repository: IssueRepository) {}

  public async execute(input: AddChildIssueInput): Promise<string> {
    const parentIssue = await this.repository.findIssueSubtree(
      IssueId.fromString(input.parentId)
    );

    if (!parentIssue) {
      throw new Error("Parent issue not found");
    }

    const newChildId = crypto.randomUUID();
    const newChild = new Issue(
      IssueId.fromString(newChildId),
      new IssueTitle(input.childTitle),
      new IssueNote(""),
      false,
      [],
      new Date()
    );

    const updatedParent = new Issue(
      parentIssue.id,
      parentIssue.title,
      parentIssue.note,
      parentIssue.isResolved,
      [...parentIssue.children, newChild],
      parentIssue.createdAt
    );

    await this.repository.updateIssue(updatedParent);
    return newChildId;
  }
}