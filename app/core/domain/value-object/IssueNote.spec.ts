import { describe, expect, test } from "vitest";
import { IssueNote } from "./IssueNote";

describe("IssueNote", () => {
  test("空文字を入れて生成できること", () => {
    expect(new IssueNote("").value).toBe("");
  });

  test("2001文字以上を入れて生成しようとするとエラーになること", () => {
    expect(() => new IssueNote("a".repeat(2001))).toThrow();
  });

  test("3000文字入れて生成できること", () => {
    const str = "a".repeat(3000);
    expect(new IssueNote(str).value).toBe(str);
  });

  test("1文字入れて生成できること", () => {
    expect(new IssueNote("a").value).toBe("a");
  });
});
