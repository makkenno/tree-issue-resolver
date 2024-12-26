import type { Meta, StoryObj } from "@storybook/react";

import { IssueForm } from "./IssueForm";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof IssueForm> = {
  component: IssueForm,
};

export default meta;
type Story = StoryObj<typeof IssueForm>;

export const Default: Story = {
  args: {
    title: "",
    note: "",
    isResolved: false,
    children: [],
    onSubmit: (value) =>
      new Promise(() => setTimeout(() => console.log(value), 1000)),
  },
};

export const FillTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const issueTextbox = canvas.getByRole("textbox", { name: "課題" });
    const noteTextarea = canvas.getByRole("textbox", { name: "メモ" });
    const isResolvedCheckbox = canvas.getByRole("checkbox", {
      name: "解決した",
    });

    await userEvent.type(issueTextbox, "地球とは何か？");
    await userEvent.type(noteTextarea, "地球とは太陽系の惑星");
    await userEvent.click(isResolvedCheckbox);

    expect(issueTextbox).toHaveValue("地球とは何か？");
    expect(noteTextarea).toHaveValue("地球とは太陽系の惑星");
    expect(isResolvedCheckbox).toBeChecked();
  },
};
