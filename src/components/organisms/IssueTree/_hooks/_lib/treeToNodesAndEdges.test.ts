import { treeToNodesAndeEdges } from "./treeToNodesAndEdges";
import { describe, it, expect } from "vitest";

describe("treeToNodesAndEdges", () => {
  it("1階層のツリーでちゃんと変換できること", () => {
    const { nodes, edges } = treeToNodesAndeEdges({
      id: "1",
      title: "地球とは何か？",
      isResolved: false,
      children: [],
    });

    const expectedNodes = [
      {
        id: "1",
        position: { x: 0, y: 0 },
        type: "issueCard",
        data: { id: "1", title: "地球とは何か？", isResolved: false },
      },
    ];
    const expectedEdges: any[] = [];
    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges);
  });

  it("2階層のツリーでちゃんと変換できること", () => {
    const { nodes, edges } = treeToNodesAndeEdges({
      id: "1",
      title: "地球とは何か？",
      isResolved: false,
      children: [
        {
          id: "2",
          title: "生物とは何か？",
          isResolved: false,
          children: [],
        },
        {
          id: "3",
          title: "宇宙とは何か？",
          isResolved: true,
          children: [],
        },
      ],
    });

    const expectedNodes = [
      {
        id: "1",
        position: { x: 0, y: 0 },
        type: "issueCard",
        data: { id: "1", title: "地球とは何か？", isResolved: false },
      },
      {
        id: "2",
        position: { x: 240, y: 0 },
        type: "issueCard",
        data: { id: "2", title: "生物とは何か？", isResolved: false },
      },
      {
        id: "3",
        position: { x: 240, y: 60 },
        type: "issueCard",
        data: { id: "3", title: "宇宙とは何か？", isResolved: true },
      },
    ];
    const expectedEdges = [
      { id: "1-2", source: "1", target: "2" },
      { id: "1-3", source: "1", target: "3" },
    ];
    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges);
  });

  it("3階層のツリーでちゃんと変換できること", () => {
    const { nodes, edges } = treeToNodesAndeEdges({
      id: "1",
      title: "地球とは何か？",
      isResolved: false,
      children: [
        {
          id: "2",
          title: "生物とは何か？",
          isResolved: false,
          children: [],
        },
        {
          id: "3",
          title: "宇宙とは何か？",
          isResolved: true,
          children: [
            {
              id: "4",
              title: "銀河とは何か？",
              isResolved: true,
              children: [],
            },
          ],
        },
      ],
    });

    const expectedNodes = [
      {
        id: "1",
        position: { x: 0, y: 0 },
        type: "issueCard",
        data: { id: "1", title: "地球とは何か？", isResolved: false },
      },
      {
        id: "2",
        position: { x: 240, y: 0 },
        type: "issueCard",
        data: { id: "2", title: "生物とは何か？", isResolved: false },
      },
      {
        id: "3",
        position: { x: 240, y: 60 },
        type: "issueCard",
        data: { id: "3", title: "宇宙とは何か？", isResolved: true },
      },
      {
        id: "4",
        position: { x: 480, y: 60 },
        type: "issueCard",
        data: { id: "4", title: "銀河とは何か？", isResolved: true },
      },
    ];
    const expectedEdges = [
      { id: "1-2", source: "1", target: "2" },
      { id: "1-3", source: "1", target: "3" },
      { id: "3-4", source: "3", target: "4" },
    ];
    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges);
  });
});
