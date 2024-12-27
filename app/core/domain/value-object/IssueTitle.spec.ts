import { describe, expect, test } from "vitest";
import { IssueTitle } from "./IssueTitle";

describe("IssueTitle", () => {
  test("空文字を入れて生成しようとするとエラーになること", () => {
    expect(() => new IssueTitle("")).toThrow();
  });

  test("257文字以上を入れて生成しようとするとエラーになること", () => {
    expect(() => new IssueTitle("a".repeat(257))).toThrow();
  });

  test("256文字入れて生成できること", () => {
    const str = "a".repeat(256);
    expect(new IssueTitle(str).value).toBe(str);
  });

  test("1文字入れて生成できること", () => {
    expect(new IssueTitle("a").value).toBe("a");
  });
});
