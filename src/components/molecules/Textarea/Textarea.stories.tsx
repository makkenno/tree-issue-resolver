import type { Meta, StoryObj } from "@storybook/react";

import { Textarea } from "./Textarea";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "ラベル",
    description: "説明",
    placeholder: "プレースホルダー",
  },
};

export const TypeTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textareaElement = canvas.getByRole("textbox", { name: "ラベル" });

    await userEvent.type(textareaElement, "タイプした");

    expect(textareaElement).toHaveValue("タイプした");
  },
};
