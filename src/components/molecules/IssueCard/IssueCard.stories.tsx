import type { Meta, StoryObj } from "@storybook/react";

import { IssueCard } from "./IssueCard";
import { expect, within } from "@storybook/test";

const meta: Meta<typeof IssueCard> = {
  component: IssueCard,
};

export default meta;
type Story = StoryObj<typeof IssueCard>;

export const Default: Story = {
  args: {
    title: "地球って何？",
  },
};

export const DisplayTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(/地球って何？/)).toBeInTheDocument();
  },
};
