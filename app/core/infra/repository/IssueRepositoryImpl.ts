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
    const allIssueRecords = await db.issues.toArray();
    const targetRecord = allIssueRecords.find(
      (record) => record.id === issue.id.value
    );
    if (targetRecord === undefined) {
      throw new Error("Issue not found");
    }

    const currentChildRecords = this.buildSubtree(
      targetRecord,
      allIssueRecords
    ).children.map((childIssue, index) => ({
      id: childIssue.id.value,
      title: childIssue.title.value,
      note: childIssue.note.value,
      isResolved: childIssue.isResolved,
      parentIssueId: issue.id.value,
      order: index,
      createdAt: childIssue.createdAt,
    }));

    const updatedParentRecord = {
      id: issue.id.value,
      title: issue.title.value,
      note: issue.note.value,
      isResolved: issue.isResolved,
      parentIssueId: targetRecord.parentIssueId,
      order: targetRecord.order,
      createdAt: issue.createdAt,
    };

    const updatedChildRecords = issue.children.map((childIssue, index) => ({
      id: childIssue.id.value,
      title: childIssue.title.value,
      note: childIssue.note.value,
      isResolved: childIssue.isResolved,
      parentIssueId: issue.id.value,
      order: index,
      createdAt: childIssue.createdAt,
    }));

    const recordsToDelete = currentChildRecords.filter(
      (record) => !updatedChildRecords.some((child) => child.id === record.id)
    );

    const { add: recordsToAdd, update: recordsToUpdate } = Object.groupBy(
      updatedChildRecords,
      (child) => {
        if (currentChildRecords.some((current) => current.id === child.id)) {
          return "update";
        }
        return "add";
      }
    );

    if (!!recordsToDelete && recordsToDelete.length > 0) {
      await db.issues.bulkDelete(recordsToDelete.map((record) => record.id));
    }
    if (!!recordsToAdd && recordsToAdd.length > 0) {
      await db.issues.bulkAdd(recordsToAdd);
    }
    if (!!recordsToUpdate && recordsToUpdate.length > 0) {
      await db.issues.bulkPut([updatedParentRecord, ...recordsToUpdate]);
    }
    await db.issues.put(updatedParentRecord);
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
