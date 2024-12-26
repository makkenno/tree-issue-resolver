import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "./TextInput";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof TextInput> = {
  component: TextInput,
};

export default meta;
type Story = StoryObj<typeof TextInput>;

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
    const textInputElement = canvas.getByRole("textbox", { name: "ラベル" });

    await userEvent.type(textInputElement, "タイプした");

    expect(textInputElement).toHaveValue("タイプした");
  },
};
