import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';
import {
  User,
  Mail,
  Lock,
  Search,
  AtSign,
  Phone,
  CalendarDays,
  CreditCard,
  Link as LinkIcon
} from 'lucide-react';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withLabel: true,
    placeholder: 'Enter text...',
    inputSize: 'base',
    className: 'w-[320px]',
  },
  argTypes: {
    withLabel: {
      control: 'boolean',
      description: 'Whether to show a label above the input',
      defaultValue: true,
    },
    label: {
      control: 'text',
      description: 'Label text (requires withLabel to be true)',
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the input',
    },
    error: {
      control: 'boolean',
      description: 'Whether to show error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the input',
    },
    leadingIcon: {
      options: ['none', 'user', 'mail', 'lock', 'search'],
      control: { type: 'select' },
      mapping: {
        none: null,
        user: <User />,
        mail: <Mail />,
        lock: <Lock />,
        search: <Search />,
      },
      description: 'Icon to show at the start of the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// Configurable story
export const Configurator: Story = {
  args: {
    withLabel: true,
    label: 'Label',
    placeholder: 'Placeholder text',
    inputSize: 'base',
    error: false,
    disabled: false,
    required: false,
    helperText: '',
    leadingIcon: null,
  },
};

// Basic input sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        inputSize="sm"
        label="Small Input"
        placeholder="Small size"
      />
      <Input
        inputSize="base"
        label="Medium Input"
        placeholder="Medium size"
      />
      <Input
        inputSize="lg"
        label="Large Input"
        placeholder="Large size"
      />
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        label="Email"
        placeholder="Enter your email"
        leadingIcon={<Mail />}
      />
      <Input
        label="Username"
        placeholder="Enter username"
        leadingIcon={<User />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        leadingIcon={<Lock />}
      />
      <Input
        label="Search"
        type="search"
        placeholder="Search..."
        leadingIcon={<Search />}
      />
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        label="Default"
        placeholder="Default state"
      />
      <Input
        label="Disabled"
        placeholder="Disabled state"
        disabled
      />
      <Input
        label="Error"
        placeholder="Error state"
        error
        helperText="This field is required"
      />
      <Input
        label="Required"
        placeholder="Required field"
        required
      />
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] p-6 border rounded-lg space-y-4">
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          leadingIcon={<User />}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          leadingIcon={<AtSign />}
          required
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          leadingIcon={<Phone />}
        />
        <Input
          label="Date of Birth"
          type="date"
          leadingIcon={<CalendarDays />}
        />
        <Input
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          leadingIcon={<CreditCard />}
          error
          helperText="Invalid card number"
        />
        <Input
          label="Website"
          placeholder="https://example.com"
          leadingIcon={<LinkIcon />}
        />
      </div>
    </div>
  ),
};

// Without Labels
export const WithoutLabels: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        withLabel={false}
        placeholder="Search..."
        leadingIcon={<Search />}
        aria-label="Search"
      />
      <Input
        withLabel={false}
        placeholder="Enter email"
        leadingIcon={<Mail />}
        aria-label="Email input"
      />
      <Input
        withLabel={false}
        type="password"
        placeholder="Enter password"
        leadingIcon={<Lock />}
        aria-label="Password input"
      />
    </div>
  ),
};