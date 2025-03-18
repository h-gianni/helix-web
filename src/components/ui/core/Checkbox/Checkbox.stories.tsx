import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    name: {
      control: 'text',
      description: 'The name of the checkbox for form submission',
    },
    value: {
      control: 'text',
      description: 'The value of the checkbox for form submission',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked by default',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback when the checkbox checked state changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Basic example with controls
export const Default: Story = {
  args: {
    disabled: false,
  },
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <label htmlFor="unchecked" className="text-sm font-medium">
          Unchecked
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="checked" defaultChecked />
        <label htmlFor="checked" className="text-sm font-medium">
          Checked
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <label htmlFor="disabled" className="text-sm font-medium text-muted-foreground">
          Disabled
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <label htmlFor="disabled-checked" className="text-sm font-medium text-muted-foreground">
          Disabled (Checked)
        </label>
      </div>
    </div>
  ),
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    // Using React hooks in a render function
    return (
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
            <p className="text-sm text-muted-foreground">
              You agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-sm space-y-6 rounded-lg border p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Newsletter Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Select the types of emails you would like to receive
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Checkbox id="marketing" defaultChecked />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="marketing"
              className="text-sm font-medium leading-none"
            >
              Marketing emails
            </label>
            <p className="text-sm text-muted-foreground">
              Receive emails about new products, features, and more.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Checkbox id="updates" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="updates"
              className="text-sm font-medium leading-none"
            >
              Product updates
            </label>
            <p className="text-sm text-muted-foreground">
              Receive emails about updates to products you use.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Checkbox id="security" defaultChecked />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="security"
              className="text-sm font-medium leading-none"
            >
              Security emails
            </label>
            <p className="text-sm text-muted-foreground">
              Receive emails about your account security.
            </p>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Save preferences
      </button>
    </form>
  ),
};

// Custom Size
export const CustomSize: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="small" className="h-3 w-3" />
        <label htmlFor="small" className="text-xs font-medium">
          Small Checkbox
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="default" />
        <label htmlFor="default" className="text-sm font-medium">
          Default Size
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="large" className="h-5 w-5" />
        <label htmlFor="large" className="text-base font-medium">
          Large Checkbox
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="extra-large" className="h-6 w-6" />
        <label htmlFor="extra-large" className="text-lg font-medium">
          Extra Large
        </label>
      </div>
    </div>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox 
          id="custom-1" 
          className="border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          defaultChecked
        />
        <label htmlFor="custom-1" className="text-sm font-medium">
          Purple Checkbox
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox 
          id="custom-2" 
          className="h-5 w-5 rounded-full border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
          defaultChecked
        />
        <label htmlFor="custom-2" className="text-sm font-medium">
          Teal Circle Checkbox
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox 
          id="custom-3" 
          className="border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
          defaultChecked
        />
        <label htmlFor="custom-3" className="text-sm font-medium">
          Amber Checkbox
        </label>
      </div>
    </div>
  ),
};

// Indeterminate state example
export const IndeterminateExample: Story = {
  render: () => {
    // Note: In a real implementation, you'd use React state to handle this
    return (
      <div className="space-y-4">
        <p className="text-sm">
          Note: This example shows the concept of indeterminate state. In a real implementation, 
          youd need to manage the state with React hooks.
        </p>
        
        <div className="flex items-center gap-2">
          <Checkbox id="parent" />
          <label htmlFor="parent" className="text-sm font-medium">
            Select all
          </label>
        </div>
        
        <div className="ml-6 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="child-1" />
            <label htmlFor="child-1" className="text-sm">
              Option 1
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox id="child-2" />
            <label htmlFor="child-2" className="text-sm">
              Option 2
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox id="child-3" />
            <label htmlFor="child-3" className="text-sm">
              Option 3
            </label>
          </div>
        </div>
      </div>
    );
  },
};