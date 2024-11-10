import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";

import { CreateIssueFormPage } from "./CreateIssueFormPage";

const meta: Meta<typeof CreateIssueFormPage> = {
  component: CreateIssueFormPage,
};

export default meta;
type Story = StoryObj<typeof CreateIssueFormPage>;

export const Default: Story = {};
