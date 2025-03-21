import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary-light',
        'secondary',
        'secondary-light',
        'destructive',
        'destructive-light',
        'outline',
        'accent',
        'accent-light',
        'success',
        'success-light',
        'warning',
        'warning-light',
      ],
      description: 'The visual style of the badge',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

// Basic example with configurator
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Badge',
  },
};

// All variants showcased
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4 max-w-3xl">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary-light">Primary Light</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="secondary-light">Secondary Light</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="destructive-light">Destructive Light</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="accent-light">Accent Light</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="success-light">Success Light</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="warning-light">Warning Light</Badge>
    </div>
  ),
};

// Primary variants
export const PrimaryVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary-light">Primary Light</Badge>
    </div>
  ),
};

// Secondary variants
export const SecondaryVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="secondary-light">Secondary Light</Badge>
    </div>
  ),
};

// Destructive variants
export const DestructiveVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="destructive-light">Destructive Light</Badge>
    </div>
  ),
};

// Accent variants
export const AccentVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="accent">Accent</Badge>
      <Badge variant="accent-light">Accent Light</Badge>
    </div>
  ),
};

// Success variants
export const SuccessVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="success">Success</Badge>
      <Badge variant="success-light">Success Light</Badge>
    </div>
  ),
};

// Warning variants
export const WarningVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="warning">Warning</Badge>
      <Badge variant="warning-light">Warning Light</Badge>
    </div>
  ),
};

// Outline variant
export const OutlineVariant: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// Custom styling
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Badge className="px-3 py-1 text-sm">Larger Badge</Badge>
      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
        Gradient Badge
      </Badge>
      <Badge className="rounded-md">Rounded Badge</Badge>
      <Badge className="font-bold">Bold Text</Badge>
    </div>
  ),
};

// Usage examples
export const UsageExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-md">
      {/* Status indicators */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Status Indicators</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="outline">Disabled</Badge>
        </div>
      </div>

      {/* Category labels */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Category Labels</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">UI Design</Badge>
          <Badge variant="primary-light">Frontend</Badge>
          <Badge variant="secondary">Backend</Badge>
          <Badge variant="accent-light">Documentation</Badge>
        </div>
      </div>

      {/* Notification counts */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Notification Counts</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive">12</Badge>
          <Badge variant="warning">5</Badge>
          <Badge variant="success">New</Badge>
        </div>
      </div>

      {/* Feature badges */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Feature Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">Pro</Badge>
          <Badge variant="success-light">Beta</Badge>
          <Badge variant="warning-light">Early Access</Badge>
          <Badge variant="primary-light">Premium</Badge>
        </div>
      </div>
    </div>
  ),
};