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
  title: 'Core/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    withLabel: true,
    placeholder: 'Enter text...',
    "data-size": 'base',
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
    "data-size": {
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
    "data-size": 'base',
    error: false,
    disabled: false,
    required: false,
    helperText: '',
    leadingIcon: null,
  },
};

// Basic input sizes
// Configurator story - no changes needed as it uses args pattern

// Sizes story
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        data-size="sm"
        label="Small Input"
        placeholder="Small size"
        withLabel={true}
      />
      <Input
        data-size="base" 
        label="Medium Input"
        placeholder="Medium size"
        withLabel={true}
      />
      <Input
        data-size="lg"
        label="Large Input"
        placeholder="Large size"
        withLabel={true}
      />
    </div>
  ),
 };
 
 // WithIcons story
 export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        label="Email"
        placeholder="Enter your email"
        leadingIcon={<Mail />}
        withLabel={true}
        data-size="base"
      />
      <Input 
        label="Username"
        placeholder="Enter username"
        leadingIcon={<User />}
        withLabel={true}
        data-size="base"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        leadingIcon={<Lock />}
        withLabel={true}
        data-size="base"
      />
      <Input
        label="Search"
        type="search"
        placeholder="Search..."
        leadingIcon={<Search />}
        withLabel={true}
        data-size="base"
      />
    </div>
  ),
 };
 
 // States story - update props
 export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        label="Default"
        placeholder="Default state"
        withLabel={true}
        data-size="base"
      />
      <Input
        label="Disabled"
        placeholder="Disabled state"
        disabled
        withLabel={true}
        data-size="base"
      />
      <Input
        label="Error"
        placeholder="Error state"
        error
        helperText="This field is required"
        withLabel={true}
        data-size="base"
      />
      <Input
        label="Required"
        placeholder="Required field"
        required
        withLabel={true}
        data-size="base"
      />
    </div>
  ),
 };
 
 // FormExample story - update props
 export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] p-6 border rounded-lg space-y-4">
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          leadingIcon={<User />}
          required
          withLabel={true}
          data-size="base"
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          leadingIcon={<AtSign />}
          required
          withLabel={true}
          data-size="base"
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          leadingIcon={<Phone />}
          withLabel={true}
          data-size="base"
        />
        <Input
          label="Date of Birth"
          type="date"
          leadingIcon={<CalendarDays />}
          withLabel={true}
          data-size="base"
        />
        <Input
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          leadingIcon={<CreditCard />}
          error
          helperText="Invalid card number"
          withLabel={true}
          data-size="base"
        />
        <Input
          label="Website"
          placeholder="https://example.com"
          leadingIcon={<LinkIcon />}
          withLabel={true}
          data-size="base"
        />
      </div>
    </div>
  ),
 };
 
 // WithoutLabels story - update props
 export const WithoutLabels: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input
        withLabel={false}
        placeholder="Search..."
        leadingIcon={<Search />}
        aria-label="Search"
        data-size="base"
      />
      <Input
        withLabel={false}
        placeholder="Enter email"
        leadingIcon={<Mail />}
        aria-label="Email input"
        data-size="base"
      />
      <Input
        withLabel={false}
        type="password"
        placeholder="Enter password"
        leadingIcon={<Lock />}
        aria-label="Password input"
        data-size="base"
      />
    </div>
  ),
 };