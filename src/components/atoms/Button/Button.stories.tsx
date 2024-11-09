import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";
import { Provider } from "../../../provider";

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: (Story) => (
    <Provider>
      <Story />
    </Provider>
  ),
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "hg",
  },
};
