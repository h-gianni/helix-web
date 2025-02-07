import * as React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './index';

const meta = {
 title: 'Core/Textarea',
 component: Textarea,
 parameters: {
   layout: 'centered',
 },
 tags: ['autodocs'],
 args: {
   placeholder: 'Type your message here...',
   'data-size': 'base' as const,
   withLabel: true,
   className: 'w-[320px]',
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
   'data-size': {
     control: 'select',
     options: ['sm', 'base', 'lg'],
     description: 'Size of the textarea field',
   },
   error: {
     control: 'boolean',
     description: 'Whether to show error state',
   },
   disabled: {
     control: 'boolean', 
     description: 'Whether the textarea is disabled',
   },
   required: {
     control: 'boolean',
     description: 'Whether the textarea is required', 
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
type Story = StoryObj<typeof meta>;

export const Configurator: Story = {
  args: {
    withLabel: true,
    label: 'Message',
    placeholder: 'Type your message here...',
    helperText: 'Enter your message above',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Textarea
        withLabel
        label="Small textarea"
        data-size="sm"
        placeholder="Small size..."
      />
      <Textarea
        withLabel
        label="Default textarea"
        data-size="base"
        placeholder="Default size..."
      />
      <Textarea
        withLabel
        label="Large textarea"
        data-size="lg"
        placeholder="Large size..."
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
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

export const WithCharacterCount: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
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

export const AutoResizing: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    return (
      <Textarea
        withLabel
        label="Auto-resizing textarea"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
        onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
          const target = e.currentTarget;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
        placeholder="Start typing to see the textarea grow..."
        helperText="This textarea will grow as you type"
      />
    );
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] p-6 border rounded-lg space-y-4">
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
          data-size="lg"
          helperText="Share your thoughts in detail"
        />
      </div>
    </div>
  ),
};