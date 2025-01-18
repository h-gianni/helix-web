import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { Mail, ArrowRight, Plus, Search, Settings } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'neutral',
    appearance: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'danger'],
      description: 'Color variant of the button',
    },
    appearance: {
      control: 'select',
      options: ['default', 'outline', 'text', 'icon-only'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    leadingIcon: {
      control: 'boolean',
      mapping: {
        true: <Mail />,
        false: null,
      }
    },
    trailingIcon: {
      control: 'boolean',
      mapping: {
        true: <ArrowRight />,
        false: null,
      }
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

// Main playground story
export const Variants: Story = {
  render: (args) => {
    // Handle icon-only case separately
    if (args.appearance === 'icon-only') {
      return (
        <Button {...args} leadingIcon={<Plus />} aria-label="Add item">
          {/* No children for icon-only */}
        </Button>
      );
    }
    return <Button {...args} />;
  },
  args: {
    children: 'Button'
  }
};

// All variants matrix
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {(['primary', 'neutral', 'danger'] as const).map(variant => (
        <div key={variant} className="space-y-[var(--space)]">
          <h3 className="text-sm font-medium capitalize">{variant}</h3>
          <div className="grid grid-cols-4 gap-[var(--space)]">
            {(['default', 'outline', 'text'] as const).map(appearance => (
              <Button 
                key={`${variant}-${appearance}`}
                variant={variant}
                appearance={appearance}
              >
                {appearance}
              </Button>
            ))}
          </div>
          <div className="flex gap-[var(--space)]">
            <Button
              variant={variant}
              appearance="icon-only"
              leadingIcon={<Plus />}
              aria-label="Add item"
            />
            <Button
              variant={variant}
              appearance="icon-only"
              leadingIcon={<Search />}
              aria-label="Search"
            />
            <Button
              variant={variant}
              appearance="icon-only"
              leadingIcon={<Settings />}
              aria-label="Settings"
            />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { exclude: '*' }
  }
};

// States showcase
export const States: Story = {
  render: () => (
    <div className="flex gap-[var(--space)]">
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  )
};

// Icon variations
export const Icons: Story = {
  render: () => (
    <div className="flex gap-[var(--space)]">
      <Button leadingIcon={<Mail />}>
        With Leading Icon
      </Button>
      <Button trailingIcon={<ArrowRight />}>
        With Trailing Icon
      </Button>
      <div className="flex gap-[var(--space-xs)]">
        <Button 
          appearance="icon-only" 
          leadingIcon={<Plus />}
          aria-label="Add item" 
        />
        <Button 
          appearance="icon-only" 
          leadingIcon={<Search />}
          aria-label="Search" 
        />
        <Button 
          appearance="icon-only" 
          leadingIcon={<Settings />}
          aria-label="Settings" 
        />
      </div>
    </div>
  )
};