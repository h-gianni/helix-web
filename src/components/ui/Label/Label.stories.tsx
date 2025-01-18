import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './index';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof Label>;

// Basic label with controls
export const Default: Story = {
  args: {
    children: 'Label Text',
    error: false,
    required: false,
    htmlFor: 'default-input',
  },
  render: (args) => (
    <div className="space-y-0.5">
      <Label {...args} />
      <Input
        withLabel={false}
        id={args.htmlFor}
        type="text"
        placeholder="Enter text"
        error={args.error}
      />
    </div>
  ),
};

// Standalone Label Examples
export const StandaloneLabels: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Label>Default Label</Label>
      <Label required>Required Label</Label>
      <Label error>Error Label</Label>
      <Label disabled>Disabled Label</Label>
    </div>
  ),
};

// Input with Built-in Label
export const InputWithLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        withLabel
        label="Default Input"
        placeholder="Enter text"
      />
      <Input
        withLabel
        label="Required Input"
        placeholder="Required field"
        required
      />
      <Input
        withLabel
        label="Error Input"
        placeholder="Error field"
        error
        helperText="This field contains an error"
      />
      <Input
        withLabel
        label="Disabled Input"
        placeholder="Disabled field"
        disabled
      />
    </div>
  ),
};

// With checkbox example
export const WithCheckbox: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" required />
        <Label htmlFor="terms" required>Accept terms</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" disabled>Disabled option</Label>
      </div>
    </div>
  ),
};

// Form group example
export const FormExample: Story = {
  render: () => (
    <form className="space-y-4">
      <Input
        withLabel
        label="Username"
        placeholder="Enter username"
        required
      />
      <Input
        withLabel
        label="Email"
        type="email"
        placeholder="Enter email"
        required
      />
      <Input
        withLabel
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        error
        helperText="Password must be at least 8 characters"
      />
      <div className="flex items-center gap-2 pt-2">
        <Checkbox id="form-terms" required />
        <Label htmlFor="form-terms" required>
          I accept the terms and conditions
        </Label>
      </div>
    </form>
  ),
};

// Helper Text Examples
export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        withLabel
        label="Username"
        placeholder="Enter username"
        helperText="Choose a unique username"
      />
      <Input
        withLabel
        label="Password"
        type="password"
        placeholder="Enter password"
        error
        helperText="Password is too weak"
      />
      <Input
        withLabel
        label="Email"
        type="email"
        placeholder="Enter email"
        disabled
        helperText="Contact admin to change email"
      />
    </div>
  ),
};