import Dexie, { Table } from "dexie";

export interface IssueRecord {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  isCollapsed?: boolean;
  parentIssueId: string | null; // ルートなら null
  order: number;
  createdAt: Date;
}

class IssueDexieDB extends Dexie {
  issues!: Table<IssueRecord, string>;

  constructor() {
    super("IssueDatabase");
    this.version(3).stores({
      issues: "id, parentIssueId, createdAt, order",
    });
  }
}

export const db = new IssueDexieDB();
