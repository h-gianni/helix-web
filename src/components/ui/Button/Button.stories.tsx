import type { Meta, StoryObj } from "@storybook/react";
import { StoryFn } from "@storybook/react";

import { Button } from ".";
// import { Button, ButtonVariants } from '../dist/index';

// import Center from '../../lib/center/Center';

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [
    (Story: StoryFn) => (
      // <Center>
      <Story />
      // </Center>
    ),
  ],
  title: "Actions/Button",
  tags: ["autodocs"],
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: (args) => {
    return <Button {...args}>Test</Button>;
  },
};
