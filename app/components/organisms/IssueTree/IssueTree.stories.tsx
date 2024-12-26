import type { Meta, StoryObj } from "@storybook/react";

import { IssueTree } from "./IssueTree";

// IssueTreeのモックデータを作成
const mockIssueTree: IssueTree = {
  id: "1",
  title: "Root Issue",
  isResolved: false,
  children: [
    {
      id: "1-1",
      title: "Sub Issue 1-1",
      isResolved: false,
      children: [
        {
          id: "1-1-1",
          title: "Sub Issue 1-1-1",
          isResolved: false,
          children: [
            {
              id: "1-1-1-1",
              title: "Sub Issue 1-1-1-1",
              isResolved: false,
              children: [
                {
                  id: "1-1-1-1-1",
                  title: "Sub Issue 1-1-1-1-1",
                  isResolved: true,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: "1-1-2",
          title: "Sub Issue 1-1-2",
          isResolved: false,
          children: [],
        },
      ],
    },
    {
      id: "1-2",
      title: "Sub Issue 1-2",
      isResolved: true,
      children: [
        {
          id: "1-2-1",
          title: "Sub Issue 1-2-1",
          isResolved: true,
          children: [
            {
              id: "1-2-1-1",
              title: "Sub Issue 1-2-1-1",
              isResolved: true,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "1-3",
      title: "Sub Issue 1-3",
      isResolved: false,
      children: [
        {
          id: "1-3-1",
          title: "Sub Issue 1-3-1",
          isResolved: true,
          children: [
            {
              id: "1-3-1-1",
              title: "Sub Issue 1-3-1-1",
              isResolved: true,
              children: [
                {
                  id: "1-3-1-1-1",
                  title: "Sub Issue 1-3-1-1-1",
                  isResolved: true,
                  children: [],
                },
                {
                  id: "1-3-1-1-2",
                  title: "Sub Issue 1-3-1-1-2",
                  isResolved: true,
                  children: [],
                },
              ],
            },
          ],
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
