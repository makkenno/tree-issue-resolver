import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "./Checkbox";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "ラベル",
    description: "説明",
  },
};

export const ClickTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxElement = canvas.getByRole("checkbox", { name: "ラベル" });

    await userEvent.click(checkboxElement);

    expect(checkboxElement).toBeChecked();
  },
};
