import { describe, expect, test } from "vitest";
import { IssueId } from "./IssueId";

describe("IssueId", () => {
  test("空文字を入れて生成したらエラーになること", () => {
    expect(() => IssueId.fromString("")).toThrow();
  });

  test("uuid以外を入れて生成したらエラーになること", () => {
    expect(() => IssueId.fromString("hogehoge")).toThrow();
  });

  test("uuidを入れて生成したら生成できること", () => {
    const rawUUID = "b9576b6b-45c0-440f-8703-5571466eef60";
    expect(IssueId.fromString(rawUUID).value).toBe(rawUUID);
  });

  test("オブジェクトを生成したらvalueにuuidが生成できること", () => {
    expect(IssueId.create().value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test("同じuuidから生成したオブジェクトは等価", () => {
    const rawUUID = "b9576b6b-45c0-440f-8703-5571466eef60";
    const issueId1 = IssueId.fromString(rawUUID);
    const issueId2 = IssueId.fromString(rawUUID);
    expect(issueId1.isEqual(issueId2)).toBe(true);
  });

  test("違うuuidから生成したオブジェクトは等価", () => {
    const rawUUID = "b9576b6b-45c0-440f-8703-5571466eef60";
    const rawUUID2 = "00006b6c-45c0-440f-8703-5571466eef60";
    const issueId1 = IssueId.fromString(rawUUID);
    const issueId2 = IssueId.fromString(rawUUID2);
    expect(issueId1.isEqual(issueId2)).toBe(false);
  });
});
