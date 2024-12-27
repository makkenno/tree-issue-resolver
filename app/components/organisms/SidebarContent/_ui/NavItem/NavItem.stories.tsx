// NavItem.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

import { NavItem } from "./NavItem";

const meta: Meta<typeof NavItem> = {
  component: NavItem,
};

export default meta;
type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: {
    to: "/some/path",
    label: "My Nav Label",
    onDelete: () => console.log("Delete called!"),
  },
};

export const InteractionTest: Story = {
  ...Default,
  args: {
    to: "/test/path",
    label: "Test Label",
    onDelete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const labelElement = canvas.getByText("Test Label");
    expect(labelElement).toBeInTheDocument();

    const linkElement = canvas.getByRole("link", { name: "Test Label" });
    expect(linkElement).toHaveAttribute("href", "/test/path");

    const menuButton = canvas.getByRole("button");
    await userEvent.click(menuButton);

    const deleteMenuItem = within(canvasElement.parentElement!).getByRole(
      "menuitem",
      {
        name: "削除",
      }
    );
    expect(deleteMenuItem).toBeInTheDocument();
    await userEvent.click(deleteMenuItem);

    expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};
