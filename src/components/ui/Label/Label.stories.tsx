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

export const Default: Story = {
  args: {
    children: 'Label Text',
    error: false,
    required: false,
    disabled: false,
    htmlFor: 'default-input',
  },
  render: (args) => (
    <div className="ui-form-layout">
      <Label {...args} />
      <Input
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

export const StandaloneLabels: Story = {
  render: () => (
    <div className="ui-form-layout">
      <Label className="ui-text-body">Default Label</Label>
      <Label className="ui-text-body" required>Required Label</Label>
      <Label className="ui-text-body" error>Error Label</Label>
      <Label className="ui-text-body" disabled>Disabled Label</Label>
    </div>
  ),
};

export const InputWithLabel: Story = {
  render: () => (
    <div className="ui-form-layout">
      <Input
        label="Default Input"
        placeholder="Enter text"
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Required Input"
        placeholder="Required field"
        required
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Error Input"
        placeholder="Error field"
        error
        helperText="This field contains an error"
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Disabled Input"
        placeholder="Disabled field"
        disabled
        className="ui-form-element"
        data-size="base"
      />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="ui-form-layout">
      <div className="ui-checkbox-label-wrapper">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      
      <div className="ui-checkbox-label-wrapper">
        <Checkbox id="terms" required />
        <Label htmlFor="terms" required>Accept terms</Label>
      </div>
      
      <div className="ui-checkbox-label-wrapper">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" disabled>Disabled option</Label>
      </div>

      <div className="ui-checkbox-label-wrapper">
        <Checkbox id="with-description" />
        <div>
          <Label htmlFor="with-description">With description</Label>
          <p className="ui-text-body-helper">This checkbox uses the built-in label functionality</p>
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="ui-form-layout">
      <Input
        label="Username"
        placeholder="Enter username"
        required
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        required
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        error
        helperText="Password must be at least 8 characters"
        className="ui-form-element"
        data-size="base"
      />
      <div className="ui-checkbox-label-wrapper">
        <Checkbox id="form-terms" required />
        <Label htmlFor="form-terms" required>I accept the terms and conditions</Label>
      </div>
    </form>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="ui-form-layout">
      <Input
        label="Username"
        placeholder="Enter username"
        helperText="Choose a unique username"
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        error
        helperText="Password is too weak"
        className="ui-form-element"
        data-size="base"
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        disabled
        helperText="Contact admin to change email"
        className="ui-form-element"
        data-size="base"
      />
    </div>
  ),
};