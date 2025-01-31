import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectField,
} from './index';

const meta = {
  title: 'Components/Select',
  component: SelectField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withLabel: true,
    width: 'inline',
    size: 'base',
  },
  argTypes: {
    withLabel: {
      control: 'boolean',
      description: 'Whether to show a label above the select',
      defaultValue: true,
    },
    label: {
      control: 'text',
      description: 'Label text (requires withLabel to be true)',
    },
    width: {
      control: 'select',
      options: ['inline', 'full'],
      description: 'Width of the select component',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the select component',
    },
    error: {
      control: 'boolean',
      description: 'Whether to show error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the select',
    },
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof SelectField>;

// Configurable story
export const Configurator: Story = {
  args: {
    withLabel: true,
    label: 'Select an option',
    width: 'inline',
    size: 'base',
    error: false,
    disabled: false,
    required: false,
    helperText: '',
  },
  render: (args) => (
    <div className="w-[320px]">
      <SelectField {...args}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>
    </div>
  ),
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SelectField
        label="Small Select"
        size="sm"
      >
        <SelectTrigger>
          <SelectValue placeholder="Small size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Base Select"
        size="base"
      >
        <SelectTrigger>
          <SelectValue placeholder="Base size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Large Select"
        size="lg"
      >
        <SelectTrigger>
          <SelectValue placeholder="Large size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>
    </div>
  ),
};

// Width variations
export const Widths: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4 w-[800px]">
      <SelectField
        label="Inline Width"
        width="inline"
      >
        <SelectTrigger>
          <SelectValue placeholder="Inline width" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Full Width"
        width="full"
      >
        <SelectTrigger>
          <SelectValue placeholder="Full width" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SelectField
        label="Default State"
      >
        <SelectTrigger>
          <SelectValue placeholder="Default state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Required"
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Required field" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="With Helper Text"
        helperText="Please select an option from the list"
      >
        <SelectTrigger>
          <SelectValue placeholder="With helper text" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Error State"
        error
        helperText="This field is required"
      >
        <SelectTrigger>
          <SelectValue placeholder="Error state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Disabled"
        disabled
      >
        <SelectTrigger>
          <SelectValue placeholder="Disabled state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] p-6 border rounded-lg space-y-4">
      <SelectField
        label="Country"
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Language"
        helperText="Choose your preferred language"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        label="Time Zone"
        error
        helperText="Please select a time zone"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select time zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pst">Pacific Time (PT)</SelectItem>
          <SelectItem value="mst">Mountain Time (MT)</SelectItem>
          <SelectItem value="cst">Central Time (CT)</SelectItem>
          <SelectItem value="est">Eastern Time (ET)</SelectItem>
        </SelectContent>
      </SelectField>
    </div>
  ),
};

// Without Labels
export const WithoutLabels: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SelectField
        withLabel={false}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>

      <SelectField
        withLabel={false}
        error
        helperText="Please make a selection"
      >
        <SelectTrigger>
          <SelectValue placeholder="With error" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </SelectField>
    </div>
  ),
};