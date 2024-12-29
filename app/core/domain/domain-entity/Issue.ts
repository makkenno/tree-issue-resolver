import { IssueType } from "~/core/usecase/IssueType";
import { IssueId } from "../value-object/IssueId";
import { IssueNote } from "../value-object/IssueNote";
import { IssueTitle } from "../value-object/IssueTitle";

export class Issue {
  constructor(
    public readonly id: IssueId,
    public readonly title: IssueTitle,
    public readonly note: IssueNote,
    public readonly isResolved: boolean,
    public readonly children: Issue[],
    public readonly createdAt: Date
  ) {}

  static fromObject(obj: IssueType): Issue {
    return new Issue(
      IssueId.fromString(obj.id),
      new IssueTitle(obj.title),
      new IssueNote(obj.note),
      obj.isResolved,
      obj.children.map((child) => Issue.fromObject(child)),
      new Date()
    );
  }
}
