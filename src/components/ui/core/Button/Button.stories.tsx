import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { Mail, ArrowRight, Plus, Search, Settings } from 'lucide-react';

const meta = {
  title: 'Core/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'neutral',
    size: 'base',
    shape: 'beveled',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'warning', 'danger'],
      description: 'Base variant of the button',
    },
    volume: {
      control: 'select',
      options: ['loud', 'moderate', 'soft'],
      description: 'Visual emphasis of the button',
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
    iconOnly: { 
      control: 'boolean',
      description: 'Whether the button shows only an icon'
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
    if (args.iconOnly) {
      return (
        <Button {...args} leadingIcon={<Plus />} aria-label="Add item" />
      );
    }
    return <Button {...args} />;
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      {(['neutral', 'primary', 'warning', 'danger'] as const).map(variant => (
        <div key={variant} className="space-y-base">
          <h3 className="ui-text-body" data-variant="small">{variant}</h3>
          <div className="grid grid-cols-3 gap-base">
            <Button variant={variant} volume="loud">Loud</Button>
            <Button variant={variant} volume="moderate">Moderate</Button>
            <Button variant={variant} volume="soft">Soft</Button>
          </div>
          <div className="flex gap-base">
            {[Plus, Search, Settings].map((Icon, idx) => (
              <Button
                key={idx}
                variant={variant}
                iconOnly
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
    <div className="flex items-center gap-base">
      <Button size="sm">Small</Button>
      <Button size="base">Base</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-base">
      <Button size="sm" iconOnly leadingIcon={<Plus />} aria-label="Add small" />
      <Button size="base" iconOnly leadingIcon={<Plus />} aria-label="Add base" />
      <Button size="lg" iconOnly leadingIcon={<Plus />} aria-label="Add large" />
    </div>
  )
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-base">
      <Button shape="beveled">Beveled Button</Button>
      <Button shape="rounded">Rounded Button</Button>
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="flex gap-base">
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  )
};

export const Icons: Story = {
  render: () => (
    <div className="flex gap-base">
      <Button leadingIcon={<Mail />}>
        With Leading Icon
      </Button>
      <Button trailingIcon={<ArrowRight />}>
        With Trailing Icon
      </Button>
      <div className="flex gap-xs">
        {[Plus, Search, Settings].map((Icon, idx) => (
          <Button 
            key={idx}
            iconOnly 
            leadingIcon={<Icon />}
            aria-label={`${Icon.name} action`} 
          />
        ))}
      </div>
    </div>
  )
};