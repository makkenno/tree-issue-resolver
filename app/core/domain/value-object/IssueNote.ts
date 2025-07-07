import * as z from "zod";

export class IssueNote {
  public constructor(public readonly value: string) {
    if (!z.string().max(30000).safeParse(value).success) {
      throw new Error(`Invalid IssueNote: ${value}`);
    }
  }
}
