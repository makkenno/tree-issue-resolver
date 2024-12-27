import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";

import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    onClickMenu: () => console.log("Menu icon clicked!"),
  },
};

export const MenuClickTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const menuButton = canvas.getByRole("button");

    expect(menuButton).toBeEnabled();
  },
};

export const LinksTest: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const homeLink = canvas.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const outputLink = canvas.getByRole("link", { name: "Output" });
    expect(outputLink).toBeInTheDocument();
    expect(outputLink).toHaveAttribute("href", "/output");

    const importLink = canvas.getByRole("link", { name: "Import" });
    expect(importLink).toBeInTheDocument();
    expect(importLink).toHaveAttribute("href", "/import");
  },
};
