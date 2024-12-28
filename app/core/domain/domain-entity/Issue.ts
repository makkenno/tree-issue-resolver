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
}
