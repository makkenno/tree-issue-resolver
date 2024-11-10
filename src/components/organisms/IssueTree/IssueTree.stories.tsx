import type { Meta, StoryObj } from "@storybook/react";

import { IssueTree } from "./IssueTree";

// IssueTreeのモックデータを作成
const mockIssueTree: IssueTree = {
  id: "1",
  title: "地球とは何か",
  isResolved: false,
  children: [
    {
      id: "2",
      title: "太陽とは何か",
      isResolved: true,
      children: [
        {
          id: "4",
          title: "核融合とは何か",
          isResolved: true,
          children: [],
        },
        {
          id: "5",
          title: "太陽系の構造",
          isResolved: false,
          children: [
            {
              id: "6",
              title: "惑星と衛星",
              isResolved: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "3",
      title: "人間とは何か",
      isResolved: false,
      children: [
        {
          id: "7",
          title: "意識とは",
          isResolved: false,
          children: [],
        },
        {
          id: "8",
          title: "生物学的構造",
          isResolved: true,
          children: [],
        },
      ],
    },
  ],
};

const meta: Meta<typeof IssueTree> = {
  component: IssueTree,
};

export default meta;
type Story = StoryObj<typeof IssueTree>;

export const Default: Story = {
  args: {
    tree: mockIssueTree,
  },
};
