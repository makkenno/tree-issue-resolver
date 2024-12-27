import * as z from "zod";

export class IssueId {
  private constructor(public readonly value: string) {
    if (!z.string().uuid().safeParse(value).success) {
      throw new Error(`invalid IssueId ${value}`);
    }
  }

  static fromString(rawId: string) {
    return new IssueId(rawId);
  }

  static create(): IssueId {
    const id = crypto.randomUUID();
    return new IssueId(id);
  }

  public isEqual(issueId: IssueId): boolean {
    return this.value === issueId.value;
  }
}
