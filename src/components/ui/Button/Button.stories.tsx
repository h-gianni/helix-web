import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { Mail, ArrowRight, Plus, Search, Settings } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'neutral',
    appearance: 'strong',
    size: 'base',
    shape: 'beveled',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'warning', 'danger'],
      description: 'Color variant of the button',
    },
    appearance: {
      control: 'select',
      options: ['strong', 'outline', 'text', 'icon-only'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the button',
    },
    shape: {
      control: 'select',
      options: ['beveled', 'rounded'],
      description: 'Shape of the button corners',
    },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    leadingIcon: {
      control: 'boolean',
      mapping: { true: <Mail />, false: null }
    },
    trailingIcon: {
      control: 'boolean',
      mapping: { true: <ArrowRight />, false: null }
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: (args) => {
    if (args.appearance === 'icon-only') {
      return (
        <Button {...args} leadingIcon={<Plus />} aria-label="Add item" />
      );
    }
    return <Button {...args} />;
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {(['neutral', 'primary', 'warning', 'danger'] as const).map(variant => (
        <div key={variant} className="space-y-[var(--space-base)]">
          <h3 className="text-sm font-medium capitalize">{variant}</h3>
          <div className="grid grid-cols-4 gap-[var(--space-base)]">
            {(['strong', 'outline', 'text'] as const).map(appearance => (
              <Button 
                key={`${variant}-${appearance}`}
                variant={variant}
                appearance={appearance}
              >
                {appearance}
              </Button>
            ))}
          </div>
          <div className="flex gap-[var(--space-base)]">
            {[Plus, Search, Settings].map((Icon, idx) => (
              <Button
                key={idx}
                variant={variant}
                appearance="icon-only"
                leadingIcon={<Icon />}
                aria-label={`${Icon.name} action`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--space-base)]">
      <Button size="sm">Small</Button>
      <Button size="base">Base</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-[var(--space-base)]">
      <Button shape="beveled">Beveled Button</Button>
      <Button shape="rounded">Rounded Button</Button>
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="flex gap-[var(--space-base)]">
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  )
};

export const Icons: Story = {
  render: () => (
    <div className="flex gap-[var(--space-base)]">
      <Button leadingIcon={<Mail />}>
        With Leading Icon
      </Button>
      <Button trailingIcon={<ArrowRight />}>
        With Trailing Icon
      </Button>
      <div className="flex gap-[var(--space-xs)]">
        {[Plus, Search, Settings].map((Icon, idx) => (
          <Button 
            key={idx}
            appearance="icon-only" 
            leadingIcon={<Icon />}
            aria-label={`${Icon.name} action`} 
          />
        ))}
      </div>
    </div>
  )
};