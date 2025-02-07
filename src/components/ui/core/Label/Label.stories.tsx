import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./index";
import { Input } from "@/components/ui/core/Input";
import { Checkbox } from "@/components/ui/core/Checkbox";
import * as React from "react";

const meta = {
  title: "Core/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label Text",
    error: false,
    required: false,
    disabled: false,
    htmlFor: "default-input",
  },
  render: (args) => (
    <div className="ui-form-layout">
      <Label {...args} />
      <Input
        id={args.htmlFor}
        placeholder="Enter text"
        error={args.error}
        required={args.required}
        disabled={args.disabled}
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="ui-form-layout">
      <Label>Default Label</Label>
      <Label required>Required Label</Label>
      <Label error>Error Label</Label>
      <Label disabled>Disabled Label</Label>
    </div>
  ),
};

export const WithInputs: Story = {
  render: () => (
    <div className="ui-form-layout">
      <div className="space-y-4">
        <Input withLabel label="Default Input" placeholder="Enter text" />
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
    </div>
  ),
};

export const WithCheckboxes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <Label htmlFor="terms" required>
          Accept terms
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" disabled>
          Disabled option
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="with-description" />
        <div className="grid gap-1.5">
          <Label htmlFor="with-description">With description</Label>
          <p className="text-sm text-muted-foreground">This is a description</p>
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4">
      <Input withLabel label="Username" placeholder="Enter username" required />
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
      <div className="flex items-center space-x-2">
        <Checkbox id="form-terms" required />
        <Label htmlFor="form-terms" required>
          I accept the terms and conditions
        </Label>
      </div>
    </form>
  ),
};

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
