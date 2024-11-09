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
    href: "https://example.com",
  },
};

export const DisplayTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("link", { name: /地球って何？/ })).toHaveAttribute(
      "href",
      "https://example.com"
    );
  },
};
