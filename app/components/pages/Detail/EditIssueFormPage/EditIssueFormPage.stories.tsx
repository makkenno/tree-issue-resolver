import type { Meta, StoryObj } from "@storybook/react";

import { EditIssueFormPage } from "./EditIssueFormPage";

const meta: Meta<typeof EditIssueFormPage> = {
  component: EditIssueFormPage,
};

export default meta;
type Story = StoryObj<typeof EditIssueFormPage>;

export const Default: Story = {
  args: {
    nodeId: "1",
    title: "hoge",
    note: "hoge",
    isResolved: false,
    children: [],
  },
};
