import * as z from "zod";

export class IssueTitle {
  public constructor(public readonly value: string) {
    if (!z.string().min(1).max(256).safeParse(value).success) {
      throw new Error(`Invalid IssueTitle: ${value}`);
    }
  }
}
