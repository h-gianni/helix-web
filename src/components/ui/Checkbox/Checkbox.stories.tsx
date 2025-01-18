import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withLabel: true,
    label: "Checkbox label",
  },
  argTypes: {
    withLabel: {
      control: 'boolean',
      description: 'Whether to show the label',
      defaultValue: true,
    },
    label: {
      control: 'text',
      description: 'Label text (requires withLabel to be true)',
    },
    description: {
      control: 'text',
      description: 'Description text below label',
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    onCheckedChange: { action: 'checked' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Base story for controls
// export const Configurable: Story = {
//   args: {
//     id: "configurable-checkbox",
//     withLabel: true,
//     label: "Configurable checkbox",
//     description: "Try toggling the controls",
//   },
// };

// Basic checkbox without label
export const Default: Story = {
  args: {
    id: "default-checkbox",
    withLabel: false,
  },
};

// Checkbox with label
export const WithLabel: Story = {
  args: {
    id: "with-label-checkbox",
    withLabel: true,
    label: "Accept terms and conditions",
  },
};

// Checkbox with description
export const WithDescription: Story = {
  args: {
    id: "with-description-checkbox",
    withLabel: true,
    label: "Marketing emails",
    description: "Receive emails about new products, features, and more.",
  },
};

// Required checkbox
export const Required: Story = {
  args: {
    id: "required-checkbox",
    withLabel: true,
    label: "Required field",
    required: true,
  },
};

// States Example (not controlled by withLabel toggle)
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox
        id="checked-checkbox"
        label="Checked state"
        withLabel
        defaultChecked
      />
      <Checkbox
        id="disabled-checkbox"
        label="Disabled state"
        withLabel
        disabled
      />
      <Checkbox
        id="disabled-checked-checkbox"
        label="Disabled and checked"
        withLabel
        disabled
        defaultChecked
      />
    </div>
  ),
};

// Group Example (not controlled by withLabel toggle)
export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox
        id="group-checkbox-1"
        label="Option 1"
        withLabel
        defaultChecked
      />
      <Checkbox
        id="group-checkbox-2"
        label="Option 2"
        withLabel
      />
      <Checkbox
        id="group-checkbox-3"
        label="Option 3"
        withLabel
      />
    </div>
  ),
};

// Form Example (not controlled by withLabel toggle)
export const FormExample: Story = {
  render: () => (
    <form className="w-[400px] space-y-6">
      <div className="space-y-4">
        <h4 className="text-heading-3">Sign up for newsletters</h4>
        <div className="flex flex-col gap-4">
          <Checkbox
            id="form-updates-checkbox"
            withLabel
            label="Product updates"
            description="Get notified about new features and updates."
            defaultChecked
          />
          <Checkbox
            id="form-offers-checkbox"
            withLabel
            label="Special offers"
            description="Receive special offers and promotions."
          />
        </div>
      </div>
    </form>
  ),
};