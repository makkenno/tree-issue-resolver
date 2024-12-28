export type IssueType = {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  children: IssueType[];
};
