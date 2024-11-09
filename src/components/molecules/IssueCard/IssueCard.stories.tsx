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
    isResolved: false,
  },
};

export const Resoleved: Story = {
  args: {
    title: "地球って何？",
    isResolved: true,
  },
};

const TOO_LONG_TEXT =
  "地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？地球とは何か？そして我々はどこへ行くのか？";
export const TooLongText: Story = {
  args: {
    title: TOO_LONG_TEXT,
    isResolved: true,
  },
};
export const DisplayTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const issueCardElement = canvas.getByText(/地球って何？/);
    expect(issueCardElement).toBeInTheDocument();
  },
};
