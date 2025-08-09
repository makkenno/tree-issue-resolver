export type IssueType = {
  id: string;
  title: string;
  note: string;
  isResolved: boolean;
  isCollapsed?: boolean;
  children: IssueType[];
};
