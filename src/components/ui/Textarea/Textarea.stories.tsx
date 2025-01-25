import * as React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './index';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    placeholder: 'Type your message here...',
    inputSize: 'base',
    withLabel: true,
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
    inputSize: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the textarea field',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required state',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the textarea',
    },
    showCount: {
      control: 'boolean',
      description: 'Show character count',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

// Default with controls
export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    helperText: 'Enter your message above',
  },
  render: (args) => (
    <div className="w-[320px]">
      <Textarea {...args} />
    </div>
  ),
};

// Size variants
export const Sizes: Story = {
  render: () => (
    <div className="w-[320px] space-y-6">
      <Textarea
        withLabel
        label="Small textarea"
        inputSize="sm"
        placeholder="Small size..."
      />
      <Textarea
        withLabel
        label="Default textarea"
        inputSize="base"
        placeholder="Default size..."
      />
      <Textarea
        withLabel
        label="Large textarea"
        inputSize="lg"
        placeholder="Large size..."
      />
    </div>
  ),
};

// States example
export const States: Story = {
  render: () => (
    <div className="w-[320px] space-y-6">
      <Textarea
        withLabel
        label="Default state"
        placeholder="Default state..."
        helperText="This is a helper text"
      />

      <Textarea
        withLabel
        label="Error state"
        placeholder="Error state..."
        error
        helperText="This field is required"
      />

      <Textarea
        withLabel
        label="Disabled state"
        placeholder="Disabled state..."
        disabled
        helperText="This field is disabled"
      />

      <Textarea
        withLabel
        label="Required state"
        placeholder="Required state..."
        required
        helperText="This field is required"
      />
    </div>
  ),
};

// With character count
export const WithCharacterCount: Story = {
  render: () => (
    <div className="w-[320px] space-y-6">
      <Textarea
        withLabel
        label="With character count"
        placeholder="Type to see counter..."
        showCount
      />

      <Textarea
        withLabel
        label="With max length"
        placeholder="Limited to 100 characters..."
        maxLength={100}
        showCount
      />

      <Textarea
        withLabel
        label="Error state with count"
        placeholder="Error with counter..."
        error
        showCount
        maxLength={50}
        helperText="Please enter a valid message"
      />
    </div>
  ),
};

// Auto-resizing
export const AutoResizing: Story = {
  render: function AutoResizing() {
    const [value, setValue] = React.useState('');
    
    return (
      <div className="w-[320px]">
        <Textarea
          withLabel
          label="Auto-resizing textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          placeholder="Start typing to see the textarea grow..."
          helperText="This textarea will grow as you type"
        />
      </div>
    );
  },
};

// Form example
export const FormExample: Story = {
  render: () => (
    <form className="w-[320px] space-y-4">
      <div className="space-y-4">
        <Textarea
          withLabel
          label="Short description"
          placeholder="Enter a brief description..."
          required
          maxLength={100}
          showCount
          helperText="Briefly describe your request (max 100 characters)"
        />
        
        <Textarea
          withLabel
          label="Detailed feedback"
          placeholder="Please provide detailed feedback..."
          required
          inputSize="lg"
          helperText="Share your thoughts in detail"
        />
      </div>
    </form>
  ),
};