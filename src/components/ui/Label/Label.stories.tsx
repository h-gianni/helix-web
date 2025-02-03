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
    disabled: false,
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
        required={args.required}
        disabled={args.disabled}
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
        inputSize="base"
      />
      <Input
        withLabel
        label="Required Input"
        placeholder="Required field"
        required
        inputSize="base"
      />
      <Input
        withLabel
        label="Error Input"
        placeholder="Error field"
        error
        helperText="This field contains an error"
        inputSize="base"
      />
      <Input
        withLabel
        label="Disabled Input"
        placeholder="Disabled field"
        disabled
        inputSize="base"
      />
    </div>
  ),
};

// With checkbox example
export const WithCheckbox: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          withLabel={true}
          label="Remember me"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox
          id="terms"
          withLabel={true}
          label="Accept terms"
          required
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox
          id="disabled"
          withLabel={true}
          label="Disabled option"
          disabled
        />
      </div>

      <Checkbox
        withLabel
        label="With built-in label"
        description="This checkbox uses the built-in label functionality"
      />

      <Checkbox
        withLabel
        label="Required with description"
        description="This is a required field with a description"
        required
      />
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
        inputSize="base"
      />
      <Input
        withLabel
        label="Email"
        type="email"
        placeholder="Enter email"
        required
        inputSize="base"
      />
      <Input
        withLabel
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        error
        helperText="Password must be at least 8 characters"
        inputSize="base"
      />
      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="form-terms"
          withLabel={true}
          label="I accept the terms and conditions"
          required
        />
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
        inputSize="base"
      />
      <Input
        withLabel
        label="Password"
        type="password"
        placeholder="Enter password"
        error
        helperText="Password is too weak"
        inputSize="base"
      />
      <Input
        withLabel
        label="Email"
        type="email"
        placeholder="Enter email"
        disabled
        helperText="Contact admin to change email"
        inputSize="base"
      />
    </div>
  ),
};