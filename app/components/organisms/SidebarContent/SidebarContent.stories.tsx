// SidebarContent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { SidebarContent } from "./SidebarContent";

const meta: Meta<typeof SidebarContent> = {
  component: SidebarContent,
};

export default meta;
type Story = StoryObj<typeof SidebarContent>;

export const Default: Story = {
  args: {
    menus: [
      { id: "menu-1", title: "Menu 1" },
      { id: "menu-2", title: "Menu 2" },
    ],
    onDeleteMenu: () => console.log("Delete called!"),
    onClickNav: () => console.log("Change called!"),
  },
};

export const InteractionTest: Story = {
  args: {
    menus: [
      { id: "menu-1", title: "Menu 1" },
      { id: "menu-2", title: "Menu 2" },
    ],
    onDeleteMenu: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Menu 1")).toBeInTheDocument();
    expect(canvas.getByText("Menu 2")).toBeInTheDocument();

    const deleteButtons = canvas.getAllByRole("button");
    expect(deleteButtons).toHaveLength(2);

    await userEvent.click(deleteButtons[0]);

    const deleteMenuItems = within(canvasElement.parentElement!).getAllByRole(
      "menuitem",
      {
        name: "削除",
      }
    );
    expect(deleteMenuItems).toHaveLength(1);

    await userEvent.click(deleteMenuItems[0]);

    expect(args.onDeleteMenu).toHaveBeenCalledTimes(1);
    expect(args.onDeleteMenu).toHaveBeenCalledWith("menu-1");
  },
};
