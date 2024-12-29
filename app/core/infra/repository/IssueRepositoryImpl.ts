import { Issue } from "~/core/domain/domain-entity/Issue";
import { IssueRepository } from "~/core/domain/repository/IssueRepository";
import { IssueId } from "~/core/domain/value-object/IssueId";
import { IssueNote } from "~/core/domain/value-object/IssueNote";
import { IssueTitle } from "~/core/domain/value-object/IssueTitle";
import { db, IssueRecord } from "~/core/infra/db/Issue";

export class DexieIssueRepository implements IssueRepository {
  public async getIssues(): Promise<{ id: string; title: string }[]> {
    const issues = await db.issues
      .orderBy("createdAt")
      .reverse()
      .filter((issue) => issue.parentIssueId === null)
      .toArray();
    return issues.map((issue) => ({ id: issue.id, title: issue.title }));
  }

  public async saveRoot(issue: Issue): Promise<void> {
    const records = this.createRecords(issue, 0);
    await db.issues.bulkAdd(records);
  }

  public async findIssueSubtree(issueId: IssueId): Promise<Issue | undefined> {
    const allRecords = await db.issues.orderBy("createdAt").toArray();
    const rootRecord = allRecords.find((r) => r.id === issueId.value);
    if (rootRecord === undefined) return undefined;

    return this.buildSubtree(rootRecord, allRecords);
  }

  // 新しくもらったissueのchildrenの中に、既存のissueのidがある場合は、更新する。
  // 新しくもらったissueのchildrenの中に、既存のissueのidがない場合は、新しく追加する
  // 既存のchildrenのidが、新しくもらったissueのchildrenのidにない場合は、それ以下の子を再起的に削除する
  // つまり、既存のtreeと新しいtreeの差分をとる
  // 親とその子供の二階層分だけ考える
  public async updateIssue(issue: Issue): Promise<void> {
    const allRecords = await db.issues.toArray();
    const existingRecord = allRecords.find((r) => r.id === issue.id.value);
    if (existingRecord === undefined) {
      throw new Error("Issue not found");
    }

    const existingIssueRecords = this.buildSubtree(
      existingRecord,
      allRecords
    ).children.map((child, i) => ({
      id: child.id.value,
      title: child.title.value,
      note: child.note.value,
      isResolved: child.isResolved,
      parentIssueId: issue.id.value,
      order: i,
      createdAt: child.createdAt,
    }));

    const newIssueRecords = issue.children.map((child, i) => ({
      id: child.id.value,
      title: child.title.value,
      note: child.note.value,
      isResolved: child.isResolved,
      parentIssueId: issue.id.value,
      order: i,
      createdAt: child.createdAt,
    }));

    const remove = existingIssueRecords.filter(
      (r) => !newIssueRecords.some((c) => c.id === r.id)
    );

    const { add, update } = Object.groupBy(newIssueRecords, (child) => {
      if (existingIssueRecords.some((c) => c.id === child.id)) {
        return "update";
      }
      return "add";
    });

    if (!!remove && remove.length > 0) {
      await db.issues.bulkDelete(remove.map((r) => r.id));
    }
    if (!!add && add.length > 0) {
      await db.issues.bulkAdd(add);
    }
    if (!!update && update.length > 0) {
      await db.issues.bulkPut(update);
    }
  }

  public async removeIssue(issueId: IssueId): Promise<void> {
    const allRecords = await db.issues.toArray();
    const rootRecord = allRecords.find((r) => r.id === issueId.value);
    if (rootRecord === undefined) {
      throw new Error("Issue not found");
    }
    const subtree = this.buildSubtree(rootRecord, allRecords);
    const targetIssues = this.createRecords(subtree, rootRecord.order).map(
      (r) => r.id
    );
    await db.issues.bulkDelete(targetIssues);
  }

  private createRecords(
    issue: Issue,
    rootOrder: number,
    parentIssueId?: IssueId
  ): IssueRecord[] {
    const record: IssueRecord = {
      id: issue.id.value,
      title: issue.title.value,
      note: issue.note.value,
      isResolved: issue.isResolved,
      parentIssueId: parentIssueId ? parentIssueId.value : null,
      order: rootOrder,
      createdAt: issue.createdAt,
    };

    if (issue.children.length === 0) {
      return [record];
    }
    return [
      record,
      ...issue.children.flatMap((child, i) =>
        this.createRecords(child, i, issue.id)
      ),
    ];
  }

  private buildSubtree(rootRec: IssueRecord, allRecords: IssueRecord[]): Issue {
    const childRecords = allRecords
      .filter((r) => r.parentIssueId == rootRec.id)
      .toSorted((a, b) => a.order - b.order);

    return new Issue(
      IssueId.fromString(rootRec.id),
      new IssueTitle(rootRec.title),
      new IssueNote(rootRec.note),
      rootRec.isResolved,
      childRecords.map((r) => this.buildSubtree(r, allRecords)),
      rootRec.createdAt
    );
  }
}
