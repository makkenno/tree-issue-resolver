import Dexie, { Table } from "dexie";

export interface IssueRecord {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  parentIssueId: string | null; // ルートなら null
  createdAt: Date;
}

class IssueDexieDB extends Dexie {
  issues!: Table<IssueRecord, string>;

  constructor() {
    super("IssueDatabase");
    this.version(1).stores({
      issues: "id, parentIssueId, createdAt",
    });
  }
}

export const db = new IssueDexieDB();
