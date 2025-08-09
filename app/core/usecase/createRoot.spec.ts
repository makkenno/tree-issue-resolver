import { describe, expect, test, vi } from "vitest";
import { CreateRootUseCase, CreateRootInput } from "./createRoot";
import { IssueRepository } from "../domain/repository/IssueRepository";
import { Issue } from "../domain/domain-entity/Issue";

describe("CreateRootUseCase", () => {
  const mockRepository: IssueRepository = {
    getIssues: vi.fn(),
    findIssueSubtree: vi.fn(),
    saveRoot: vi.fn(),
    updateIssue: vi.fn(),
    removeIssue: vi.fn(),
    reorderChildIssues: vi.fn(),
  };

  test("1階層の子供を持つルートIssueを作成できること", async () => {
    const useCase = new CreateRootUseCase(mockRepository);
    const input: CreateRootInput = {
      id: "root-1",
      title: "ルートタスク",
      note: "メモ",
      isResolved: false,
      children: [
        {
          id: "child-1",
          title: "子タスク1",
        },
        {
          id: "child-2",
          title: "子タスク2",
        },
      ],
    };

    await useCase.execute(input);

    expect(mockRepository.saveRoot).toHaveBeenCalledTimes(1);
    const savedIssue = (mockRepository.saveRoot as any).mock.calls[0][0] as Issue;
    expect(savedIssue.title.value).toBe("ルートタスク");
    expect(savedIssue.children).toHaveLength(2);
    expect(savedIssue.children[0].title.value).toBe("子タスク1");
    expect(savedIssue.children[1].title.value).toBe("子タスク2");
  });

  test("深い階層のネストした子供を持つルートIssueを作成できること", async () => {
    const useCase = new CreateRootUseCase(mockRepository);
    const input: CreateRootInput = {
      id: "root-1",
      title: "ルートタスク",
      note: "メモ",
      isResolved: false,
      children: [
        {
          id: "child-1",
          title: "子タスク1",
          note: "子メモ1",
          isResolved: true,
          isCollapsed: false,
          children: [
            {
              id: "grandchild-1",
              title: "孫タスク1",
              note: "孫メモ1",
              children: [
                {
                  id: "great-grandchild-1",
                  title: "ひ孫タスク1",
                },
              ],
            },
          ],
        },
        {
          id: "child-2",
          title: "子タスク2",
          children: [
            {
              id: "grandchild-2",
              title: "孫タスク2",
            },
          ],
        },
      ],
    };

    await useCase.execute(input);

    expect(mockRepository.saveRoot).toHaveBeenCalledTimes(1);
    const savedIssue = (mockRepository.saveRoot as any).mock.calls[0][0] as Issue;
    
    // ルートレベル
    expect(savedIssue.title.value).toBe("ルートタスク");
    expect(savedIssue.children).toHaveLength(2);
    
    // 第1子レベル
    const child1 = savedIssue.children[0];
    expect(child1.title.value).toBe("子タスク1");
    expect(child1.note.value).toBe("子メモ1");
    expect(child1.isResolved).toBe(true);
    expect(child1.isCollapsed).toBe(false);
    expect(child1.children).toHaveLength(1);
    
    const child2 = savedIssue.children[1];
    expect(child2.title.value).toBe("子タスク2");
    expect(child2.children).toHaveLength(1);
    
    // 第2子（孫）レベル
    const grandchild1 = child1.children[0];
    expect(grandchild1.title.value).toBe("孫タスク1");
    expect(grandchild1.note.value).toBe("孫メモ1");
    expect(grandchild1.children).toHaveLength(1);
    
    const grandchild2 = child2.children[0];
    expect(grandchild2.title.value).toBe("孫タスク2");
    
    // 第3子（ひ孫）レベル
    const greatGrandchild1 = grandchild1.children[0];
    expect(greatGrandchild1.title.value).toBe("ひ孫タスク1");
    expect(greatGrandchild1.children).toHaveLength(0);
  });

  test("子供を持たないルートIssueを作成できること", async () => {
    const useCase = new CreateRootUseCase(mockRepository);
    const input: CreateRootInput = {
      id: "root-1",
      title: "ルートタスク",
      note: "メモ",
      isResolved: true,
      children: [],
    };

    await useCase.execute(input);

    expect(mockRepository.saveRoot).toHaveBeenCalledTimes(1);
    const savedIssue = (mockRepository.saveRoot as any).mock.calls[0][0] as Issue;
    expect(savedIssue.title.value).toBe("ルートタスク");
    expect(savedIssue.isResolved).toBe(true);
    expect(savedIssue.children).toHaveLength(0);
  });
});