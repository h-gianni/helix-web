import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { 
  ArrowRight, 
  Download, 
  Search, 
  Mail, 
  Plus, 
  Trash, 
  Settings, 
  ExternalLink 
} from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child element using Radix UI Slot',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'The content of the button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

// Basic example with configurator
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
    disabled: false,
  },
};

// All variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon"><Plus /></Button>
    </div>
  ),
};

// Icon examples
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="w-full text-lg font-medium mb-2">Leading Icons</h3>
        <Button><Search />Search</Button>
        <Button variant="outline"><Mail />Email</Button>
        <Button variant="secondary"><Download />Download</Button>
        <Button variant="destructive"><Trash />Delete</Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="w-full text-lg font-medium mb-2">Trailing Icons</h3>
        <Button>Next <ArrowRight /></Button>
        <Button variant="outline">View <ExternalLink /></Button>
        <Button variant="secondary">Settings <Settings /></Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="w-full text-lg font-medium mb-2">Icon Only Buttons</h3>
        <Button size="icon"><Plus /></Button>
        <Button size="icon" variant="outline"><Search /></Button>
        <Button size="icon" variant="secondary"><Settings /></Button>
        <Button size="icon" variant="destructive"><Trash /></Button>
        <Button size="icon" variant="ghost"><Mail /></Button>
      </div>
    </div>
  ),
};

// Disabled state
export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button disabled>Default</Button>
      <Button disabled variant="destructive">Destructive</Button>
      <Button disabled variant="outline">Outline</Button>
      <Button disabled variant="secondary">Secondary</Button>
      <Button disabled variant="ghost">Ghost</Button>
      <Button disabled variant="link">Link</Button>
    </div>
  ),
};

// Size variants combined with button variants
export const SizeVariantCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const).map(variant => (
        <div key={variant} className="flex flex-col gap-4">
          <h3 className="text-lg font-medium capitalize">{variant} Variant</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant={variant} size="sm">Small</Button>
            <Button variant={variant} size="default">Default</Button>
            <Button variant={variant} size="lg">Large</Button>
            {variant !== 'link' && (
              <Button variant={variant} size="icon"><Plus /></Button>
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};

// Loading state example
export const LoadingState: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button className="relative">
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        <span className="invisible">Loading</span>
      </Button>
      <Button>Loading...</Button>
    </div>
  ),
};

// Full width buttons
export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-4">
      <Button className="w-full">Full Width Button</Button>
      <Button className="w-full" variant="destructive">Full Width Destructive</Button>
      <Button className="w-full" variant="outline">Full Width Outline</Button>
    </div>
  ),
};

// Usage examples
export const UsageSamples: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4 max-w-2xl">
      {/* Form submission */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Form Actions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Submit</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
      
      {/* Modal actions */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Modal Actions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary">Close</Button>
          <Button variant="default">Save Changes</Button>
        </div>
      </div>
      
      {/* Dangerous actions */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Dangerous Actions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Call to Action</h3>
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <Button variant="default" size="lg">Get Started <ArrowRight /></Button>
          <Button variant="ghost">Learn More</Button>
        </div>
      </div>
    </div>
  ),
};