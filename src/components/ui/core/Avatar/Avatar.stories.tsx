import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "./index";

interface AvatarProps extends React.ComponentProps<typeof Avatar> {
  size: "sm" | "md" | "lg" | "xl";
}

const meta = {
  title: "Core/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
  },
} satisfies Meta<AvatarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example with image
export const WithImage: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

// Example with fallback (no image or failed load)
export const WithFallback: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarImage src="/broken-image.jpg" alt="@johndoe" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

// Different sizes
export const Small: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Medium: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const ExtraLarge: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

// Fallback variations
export const SingleLetter: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  ),
};

export const TwoLetters: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args}>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

// Example with custom styling
export const CustomStyling: Story = {
  render: (args: Story["args"]) => (
    <Avatar {...args} className="border-2 border-[var(--color-primary)]">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

// Group of avatars example
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>WS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>+2</AvatarFallback>
      </Avatar>
    </div>
  ),
};
