import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './index';

const meta = {
  title: 'Core/Select',
  component: Select,
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
      defaultValue: 'base',
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
    showItemIndicator: {
      control: 'boolean',
      description: 'Whether to show check mark indicator for selected item',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

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
    showItemIndicator: true,
  },
  render: (args) => (
    <div className="w-[320px]">
      <Select {...args}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Select
        label="Small Select"
        withLabel
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
      </Select>

      <Select
        label="Base Select"
        withLabel
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
      </Select>

      <Select
        label="Large Select"
        withLabel
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
      </Select>
    </div>
  ),
};

// Width variations
export const Widths: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4 w-[800px]">
      <Select
        label="Inline Width"
        withLabel
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
      </Select>

      <Select
        label="Full Width"
        withLabel
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
      </Select>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Select
        label="Default State"
        withLabel
      >
        <SelectTrigger>
          <SelectValue placeholder="Default state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      <Select
        label="Required"
        withLabel
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
      </Select>

      <Select
        label="With Helper Text"
        withLabel
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
      </Select>

      <Select
        label="Error State"
        withLabel
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
      </Select>

      <Select
        label="Disabled"
        withLabel
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
      </Select>
    </div>
  ),
};

// New story for indicator variations
export const IndicatorVariations: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Select
        label="With Indicator"
        withLabel
        showItemIndicator={true}
      >
        <SelectTrigger>
          <SelectValue placeholder="With check mark" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      <Select
        label="Without Indicator"
        withLabel
        showItemIndicator={false}
      >
        <SelectTrigger>
          <SelectValue placeholder="No check mark" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] p-6 border rounded-lg space-y-4">
      <Select
        label="Country"
        withLabel
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
      </Select>

      <Select
        label="Language"
        withLabel
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
      </Select>

      <Select
        label="Time Zone"
        withLabel
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
      </Select>
    </div>
  ),
};

// Without Labels
export const WithoutLabels: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Select
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
      </Select>

      <Select
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
      </Select>
    </div>
  ),
};