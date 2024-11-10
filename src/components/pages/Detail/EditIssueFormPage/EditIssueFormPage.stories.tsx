import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";

import { EditIssueFormPage } from "./EditIssueFormPage";

const meta: Meta<typeof EditIssueFormPage> = {
  component: EditIssueFormPage,
};

export default meta;
type Story = StoryObj<typeof EditIssueFormPage>;

export const Default: Story = {};
