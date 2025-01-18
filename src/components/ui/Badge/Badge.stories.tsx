import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "accent", "danger", "success", "warning", "info"],
      description: "Color scheme of the badge",
      table: {
        defaultValue: { summary: "default" }
      }
    },
    appearance: {
      control: "select",
      options: ["default", "light", "outline"],
      description: "Visual style of the badge",
      table: {
        defaultValue: { summary: "default" }
      }
    },
    size: {
      control: "select",
      options: ["default", "lg"],
      description: "Size of the badge",
      table: {
        defaultValue: { summary: "default" }
      }
    },
    children: {
      control: "text",
      description: "Badge content"
    },
    className: {
      control: "text",
      description: "Additional CSS classes"
    }
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

// Main configuration preview
export const Default: Story = {
  args: {
    variant: "primary",
    appearance: "default",
    size: "default",
    children: "Badge"
  }
};

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
        <div className="text-base text-neutral-500">Default</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" appearance="default">Default</Badge>
          <Badge variant="default" appearance="light">Light</Badge>
          <Badge variant="default" appearance="outline">Outline</Badge>
        </div>

        <div className="text-base text-neutral-500">Primary</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" appearance="default">Default</Badge>
          <Badge variant="primary" appearance="light">Light</Badge>
          <Badge variant="primary" appearance="outline">Outline</Badge>
        </div>

        <div className="text-base text-neutral-500">Accent</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent" appearance="default">Default</Badge>
          <Badge variant="accent" appearance="light">Light</Badge>
          <Badge variant="accent" appearance="outline">Outline</Badge>
        </div>

        <div className="text-base text-neutral-500">Danger</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="danger" appearance="default">Default</Badge>
          <Badge variant="danger" appearance="light">Light</Badge>
          <Badge variant="danger" appearance="outline">Outline</Badge>
        </div>

        <div className="text-base text-neutral-500">Success</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" appearance="default">Default</Badge>
          <Badge variant="success" appearance="light">Light</Badge>
          <Badge variant="success" appearance="outline">Outline</Badge>
        </div>

        <div className="text-base text-neutral-500">Warning</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" appearance="default">Default</Badge>
          <Badge variant="warning" appearance="light">Light</Badge>
          <Badge variant="warning" appearance="outline">Outline</Badge>
        </div>

        <div className="text-base text-neutral-500">Info</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info" appearance="default">Default</Badge>
          <Badge variant="info" appearance="light">Light</Badge>
          <Badge variant="info" appearance="outline">Outline</Badge>
        </div>
      </div>
    </div>
  )
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge>Default size</Badge>
      <Badge size="lg">Large size</Badge>
    </div>
  )
};

// Examples
export const Examples: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Status badges */}
      <div className="flex gap-2">
        <Badge variant="success" appearance="light">Active</Badge>
        <Badge variant="warning" appearance="light">Pending</Badge>
        <Badge variant="danger" appearance="light">Failed</Badge>
      </div>

      {/* Categories */}
      <div className="flex gap-2">
        <Badge variant="primary" appearance="default">Design</Badge>
        <Badge variant="primary" appearance="light">Development</Badge>
        <Badge variant="primary" appearance="outline">Marketing</Badge>
      </div>

      {/* With icon */}
      <Badge variant="success" appearance="light" className="gap-[var(--space-xxs)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[var(--size-xxs)] h-[var(--size-xxs)]"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Verified
      </Badge>

      {/* Notification */}
      <div className="flex gap-2">
        <Badge variant="danger" appearance="default" className="rounded-full">14</Badge>
        <Badge variant="primary" appearance="light" className="rounded-full">New</Badge>
      </div>
    </div>
  )
};