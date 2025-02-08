import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";
import { Check } from "lucide-react";

const meta = {
  title: "Core/Badge",
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
    volume: {
      control: "select",
      options: ["loud", "moderate", "soft"],
      description: "Visual style of the badge (loud = solid, moderate = outline, soft = light)",
      table: {
        defaultValue: { summary: "loud" }
      }
    },
    size: {
      control: "select",
      options: ["sm", "base", "lg"],
      description: "Size of the badge",
      table: {
        defaultValue: { summary: "base" }
      }
    },
    children: {
      control: "text",
      description: "Badge content"
    },
    className: {
      control: "text",
      description: "Additional CSS classes"
    },
    icon: {
      control: "boolean",
      description: "Optional icon element"
    }
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

// Main configuration preview
export const Default: Story = {
  args: {
    variant: "default",
    volume: "loud",
    size: "base",
    children: "Badge"
  }
};

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-base">
      <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
        <div className="ui-text-body-small text-weak">Default</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="default" volume="loud">Default</Badge>
          <Badge variant="default" volume="soft">Moderate</Badge>
          <Badge variant="default" volume="moderate">Soft</Badge>
        </div>

        <div className="ui-text-body-small text-weak">Primary</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="primary" volume="loud">Default</Badge>
          <Badge variant="primary" volume="soft">Moderate</Badge>
          <Badge variant="primary" volume="moderate">Soft</Badge>
        </div>

        <div className="ui-text-body-small text-weak">Accent</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="accent" volume="loud">Default</Badge>
          <Badge variant="accent" volume="soft">Moderate</Badge>
          <Badge variant="accent" volume="moderate">Soft</Badge>
        </div>

        <div className="ui-text-body-small text-weak">Danger</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="danger" volume="loud">Default</Badge>
          <Badge variant="danger" volume="soft">Moderate</Badge>
          <Badge variant="danger" volume="moderate">Soft</Badge>
        </div>

        <div className="ui-text-body-small text-weak">Success</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="success" volume="loud">Default</Badge>
          <Badge variant="success" volume="soft">Moderate</Badge>
          <Badge variant="success" volume="moderate">Soft</Badge>
        </div>

        <div className="ui-text-body-small text-weak">Warning</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="warning" volume="loud">Default</Badge>
          <Badge variant="warning" volume="soft">Moderate</Badge>
          <Badge variant="warning" volume="moderate">Soft</Badge>
        </div>

        <div className="ui-text-body-small text-weak">Info</div>
        <div className="flex flex-wrap gap-sm">
          <Badge variant="info" volume="loud">Default</Badge>
          <Badge variant="info" volume="soft">Moderate</Badge>
          <Badge variant="info" volume="moderate">Soft</Badge>
        </div>
      </div>
    </div>
  )
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-sm items-center">
      <Badge size="base">Default size</Badge>
      <Badge size="lg">Large size</Badge>
    </div>
  )
};

// Examples
export const Examples: Story = {
  render: () => (
    <div className="space-y-base">
      {/* Status badges */}
      <div className="flex gap-sm">
        <Badge variant="success" volume="moderate">Active</Badge>
        <Badge variant="warning" volume="moderate">Pending</Badge>
        <Badge variant="danger" volume="moderate">Failed</Badge>
      </div>

      {/* Categories */}
      <div className="flex gap-sm">
        <Badge variant="primary" volume="loud">Design</Badge>
        <Badge variant="primary" volume="moderate">Development</Badge>
        <Badge variant="primary" volume="soft">Marketing</Badge>
      </div>

      {/* With icon */}
      <Badge 
        variant="success" 
        volume="moderate" 
        className="gap-[var(--space-xxs)]"
        icon={<Check className="w-[var(--size-xxs)] h-[var(--size-xxs)]" />}
      >
        Verified
      </Badge>

      {/* Notification */}
      <div className="flex gap-sm">
        <Badge variant="danger" volume="loud" className="rounded-full">14</Badge>
        <Badge variant="primary" volume="moderate" className="rounded-full">New</Badge>
      </div>
    </div>
  )
};